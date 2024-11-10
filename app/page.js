'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle } from "lucide-react"

export default function YouTubeDownloader() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [videoDetails, setVideoDetails] = useState(null)
  const [downloadOptions, setDownloadOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [rawResponse, setRawResponse] = useState(null)

  const fetchVideoData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/fetchVideoData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: youtubeUrl }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setRawResponse(data)

      const options = data.formats.map(format => ({
        label: `${format.qualityLabel || 'Audio'} - ${format.mimeType.split(';')[0]}`,
        value: format.itag,
        details: format,
      }))

      setDownloadOptions(options)
      setVideoDetails(data.videoDetails)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (selectedOption && videoDetails) {
      try {
        const response = await fetch('/api/streamVideo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoUrl: youtubeUrl, itag: selectedOption }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }

        // Open the URL in a new tab
        window.open(data.url, '_blank')
      } catch (error) {
        setError(error.message)
      }
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center">YouTube Downloader</h1>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="Paste YouTube video URL"
          className="flex-grow"
          aria-label="YouTube video URL"
        />
        <Button onClick={fetchVideoData} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Fetch'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {videoDetails && (
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Video Details</TabsTrigger>
            <TabsTrigger value="response">Raw Response</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>{videoDetails.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <img
                  src={videoDetails.thumbnails[0].url}
                  alt="Video Thumbnail"
                  className="w-48 h-auto rounded-lg"
                />
                <p>Duration: {Math.floor(videoDetails.lengthSeconds / 60)}:{String(videoDetails.lengthSeconds % 60).padStart(2, '0')}</p>
                <p>Views: {videoDetails.viewCount}</p>
                <p>Author: {videoDetails.author}</p>
                <div>
                  <h3 className="font-semibold mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {videoDetails.keywords?.map((keyword, index) => (
                      <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="response">
            <Card>
              <CardHeader>
                <CardTitle>Raw API Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto max-h-96">
                  <code>{JSON.stringify(rawResponse, null, 2)}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {downloadOptions.length > 0 && (
        <div className="space-y-2">
          <Select onValueChange={setSelectedOption}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              {downloadOptions.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleDownload} disabled={!selectedOption} className="w-full">
            Open Video
          </Button>
        </div>
      )}
    </div>
  )
}