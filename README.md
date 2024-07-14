# YouTube Downloader

A web application to download YouTube videos in different qualities and formats. This project is built with React and Next.js, providing an intuitive UI for users to paste a YouTube URL, select the desired video quality, and download the video.

![Screenshot 2024-07-14 224409](https://github.com/user-attachments/assets/fb0321fa-d5ae-46e9-946b-145f5a0ac6e0)


## Features

- Paste a YouTube video URL to fetch video details
- Select from available video qualities and formats
- Download the selected video with a single click
- Displays video details such as title, duration, views, and author
- Highlights formats without audio in red for better visibility

## Live Version

Check out the live version here: [YouTube Downloader](https://youtube-downloader-reversed-engineered.vercel.app/)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/themrsami/Youtube-Downloader-Reversed-Engineered
    cd your-repo-name
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. Paste the YouTube video URL into the input field.
2. Wait for the video details and available formats to load.
3. Select the desired quality from the dropdown menu.
4. Click the download button to start downloading the video.

## API Endpoint

The application uses a custom API endpoint to fetch video data:

- **POST `/api/fetchVideoData`**: Accepts a video ID and context, and returns the available video formats and details.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-feature-branch`
5. Submit a pull request.

## License

This project is licensed under the MIT License.
