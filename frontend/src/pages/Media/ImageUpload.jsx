import axios from "axios";
import FsLightbox from "fslightbox-react";
import {
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useState, useEffect } from "react";
import { environment } from "../../lib/environment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const MediaItem = ({ item, onDelete }) => (
  <Card>
    <CardContent>
      {item.mediaType === "image" ? (
        <img
          src={item.mediaUrl}
          alt="Uploaded"
          style={{ width: "100%", height: "40px", objectFit: "cover" }}
        />
      ) : (
        <video
          src={item.mediaUrl}
          controls
          style={{ width: "100%", height: "150px" }}
        />
      )}
    </CardContent>
    <CardActions>
      <Button size="small" color="error" onClick={() => onDelete(item._id)}>
        <DeleteIcon />
      </Button>
    </CardActions>
  </Card>
);

const MediaUpload = ({ ticketID }) => {
  const [files, setFiles] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [toggler, setToggler] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filesSelected, setFilesSelected] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      // Check if ticketID is defined before making the request
      if (!ticketID) {
        console.log("TicketID is undefined.");
        return;
      }

      const response = await axios.get(
        environment.SERVER_URL + `/media?ticketID=${ticketID}`
      );
      setMediaItems(response.data);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  useEffect(() => {
    fetchMedia().then(() => setLoading(false)); // Set loading to false once media is fetched
  }, [ticketID]);

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
    setFilesSelected(true);
  };
  const handleUpload = async () => {
    const formData = new FormData();

    for (const file of files) {
      formData.append("media", file);
    }

    try {
      setUploading(true);

      formData.append("ticketID", ticketID);

      const response = await axios.post(
        environment.SERVER_URL + "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          },
        }
      );

      const newMediaItems = response.data.mediaUrls.map((item) => ({
        mediaUrl: item,
        mediaType: item.endsWith(".mp4") ? "video" : "image",
      }));

      setMediaItems((prevMediaItems) => [...prevMediaItems, ...newMediaItems]);
      setFiles([]);
      fetchMedia();
    } catch (error) {
      console.error("Error uploading media:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
    setFilesSelected(false);
  };

  const handleDelete = async (mediaId) => {
    try {
      setDeleting(true);
      setMediaToDelete(mediaId);

      const response = await axios.delete(
        environment.SERVER_URL + `/media/${mediaId}`,
        {
          onDownloadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setDeleteProgress(progress);
          },
        }
      );

      setMediaItems((prevMediaItems) =>
        prevMediaItems.filter((item) => item._id !== mediaId)
      );
      fetchMedia();
    } catch (error) {
      console.error("Error deleting media:", error);
    } finally {
      setDeleting(false);
      setDeleteProgress(0);
      setMediaToDelete(null);
    }
  };
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <div className="flex justify-between items-center mb-2">
          <label className="block font-semibold">File Upload</label>
          <div
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="cursor-pointer mt-3 border rounded-sm bg-blue-200 text-dark font-semibold inline-block px-3 py-1"
            style={{
              marginLeft: "10px",
              fontSize: "8px",
              animation: filesSelected ? "blink 1s infinite" : "none",
            }}
          >
            View File {files.length > 0 && `(${files.length})`}
          </div>
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*, video/*"
          style={{ display: "none" }}
          id="fileInput"
        />
        <label htmlFor="fileInput">
          <Button
            variant=""
            color="primary"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{
              border: "1px dotted blue",
              width: "100%",
              padding: "4rem 2rem",
              backgroundColor: "#0368ce0f",
              color: "#1b3dc5",
              "&:hover": {
                backgroundColor: "#0368ce0f",
              },
            }}
          >
            Choose File
          </Button>
        </label>

        {uploading && (
          <div>
            <CircularProgress variant="determinate" value={uploadProgress} />
            <span>{uploadProgress}%</span>
          </div>
        )}
        {deleting && (
          <div>
            <CircularProgress variant="determinate" value={deleteProgress} />
            <span>{deleteProgress}%</span>
          </div>
        )}
      </Grid>
      <Grid item xs={8}>
        {/* <h2>Uploaded Media</h2>*/}
        <div>
          <div className="mb-2">
            {mediaItems.length > 0 && (
              <div className="flex justify-between items-center">
                <label className="block font-semibold">Uploaded Files</label>
                <div
                  className="cursor-pointer mt-3 border rounded-sm bg-blue-200 text-dark font-semibold inline-block px-3 py-1"
                  onClick={() => setToggler((prevToggler) => !prevToggler)}
                  style={{ fontSize: "9px", padding: "3px 6px" }}
                >
                  Preview Media
                </div>
              </div>
            )}

            <FsLightbox
              toggler={toggler}
              sources={mediaItems.map((item) => item.mediaUrl)}
            />
            <style>
              {`
          @keyframes blink {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          .blink {
            animation: blink 1s infinite;
          }
        
        `}
            </style>
          </div>
          <Grid container spacing={2}>
            {mediaItems.map((item) => (
              <Grid key={item._id} item xs={12} sm={6} md={4} lg={3}>
                <MediaItem item={item} onDelete={handleDelete} />
              </Grid>
            ))}
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default MediaUpload;
