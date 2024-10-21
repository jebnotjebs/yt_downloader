from flask import Flask, request, jsonify, send_file
from pytubefix import YouTube
import os

app = Flask(__name__)


@app.route("/download", methods=["POST"])
def download_video():
    data = request.json  # Extract the JSON data from the request

    link = data.get("url")  # Get the YouTube link from the JSON body
    directory = data.get("directory")  # Get the chosen directory from the JSON body

    if not link or not directory:
        return jsonify({"message": "Missing URL or directory"}), 400

    try:
        yt = YouTube(link)
        video_stream = yt.streams.get_highest_resolution()
        file_name = f"{yt.title}.mp4"

        # Ensure the directory exists
        if not os.path.exists(directory):
            os.makedirs(directory)

        # Download the video file to the chosen directory
        video_stream.download(output_path=directory, filename=file_name)

        return jsonify({"message": f"Download complete: {file_name}"})

    except Exception as e:
        return jsonify({"message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
