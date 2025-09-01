import React, { useCallback, useEffect, useState, useRef } from "react";
import { useController } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  FormControl,
  FormLabel,
  FormHelperText,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  FlipCameraAndroid as FlipHorizontalIcon,
  FlipCameraIos as FlipVerticalIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const DropzoneContainer = styled(Paper)(
  ({ theme, isDragActive, hasError, hasPreview }) => ({
    border: `2px dashed ${
      hasError
        ? theme.palette.error.main
        : isDragActive
        ? theme.palette.primary.main
        : theme.palette.grey[400]
    }`,
    backgroundColor: isDragActive
      ? theme.palette.primary.light + "20"
      : hasPreview
      ? theme.palette.grey[50]
      : "transparent",
    padding: theme.spacing(2),
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    position: "relative",
    overflow: "hidden",
    minHeight: 120,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: hasPreview
        ? theme.palette.grey[50]
        : theme.palette.primary.light + "10",
    },
  })
);

const PreviewContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1),
  "&:hover .delete-button": {
    opacity: 1,
  },
}));

const PreviewMedia = styled("img")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
}));

const PreviewVideo = styled("video")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
}));

const OverlayContent = styled(Box)(({ theme, hasPreview }) => ({
  position: "relative",
  zIndex: hasPreview ? 1 : "auto",
  backgroundColor: hasPreview ? "rgba(255, 255, 255, 0.8)" : "transparent",
  padding: hasPreview ? theme.spacing(1) : 0,
  borderRadius: theme.shape.borderRadius,
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  opacity: 0,
  transition: "opacity 0.2s ease-in-out",
  zIndex: 10,
  "&:hover": {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  },
}));

const CropDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: 0,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  maxHeight: "90vh",
}));

const ToolsPanel = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    width: 200,
    flexDirection: "column",
    borderBottom: "none",
    borderRight: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.grey[100],
  minHeight: 200,
  position: "relative",
  overflow: "hidden",
}));

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export const FileUpload = ({
  name,
  label,
  description,
  control,
  className,
  containerClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  previewClassName,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 1,
  mediaType = "any",
  onFileChange,
  onUpload,
  onBlur,
  initialPreview,
  initialFile,
  standalone = false,
  enableCrop = false,
  cropAspectRatio,
  circularCrop = false,
  minWidth,
  minHeight,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: initialFile || null,
  });

  const [preview, setPreview] = useState(initialPreview);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [imgSrc, setImgSrc] = useState("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(value);
    } else if (value === null) {
      setPreview(null);
    }
  }, [value]);

  const getAcceptTypes = useCallback(
    (type) => {
      const mediaTypeToUse = type || mediaType;

      switch (mediaTypeToUse) {
        case "image":
          return {
            "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
            "image/gif": [".gif"],
            "image/webp": [".webp"],
          };
        case "video":
          return {
            "video/*": [".mp4", ".webm", ".ogg", ".mov"],
            "video/mp4": [".mp4"],
            "video/webm": [".webm"],
            "video/ogg": [".ogg"],
            "video/quicktime": [".mov"],
          };
        default:
          return {
            "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
            "image/gif": [".gif"],
            "image/webp": [".webp"],
            "video/*": [".mp4", ".webm", ".ogg", ".mov"],
            "video/mp4": [".mp4"],
            "video/webm": [".webm"],
            "video/ogg": [".ogg"],
            "video/quicktime": [".mov"],
          };
      }
    },
    [mediaType]
  );

  const handleFileChange = useCallback(
    (file) => {
      onChange(file);
      if (onFileChange) {
        onFileChange(file);
      }
    },
    [onChange, onFileChange]
  );

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    if (cropAspectRatio) {
      setCrop(centerAspectCrop(width, height, cropAspectRatio));
    }
  };

  const handleRightRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleLeftRotate = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const handleFlipHorizontal = () => {
    setFlipHorizontal((prev) => !prev);
  };

  const handleFlipVertical = () => {
    setFlipVertical((prev) => !prev);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleZoomChange = (event, value) => {
    setZoom(value);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;

    if (containerRef.current && imgRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = imgRef.current.getBoundingClientRect();

      const maxX = (imgRect.width * zoom - containerRect.width) / 2;
      const maxY = (imgRect.height * zoom - containerRect.height) / 2;

      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPos({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];

    const newX = touch.clientX - startPos.x;
    const newY = touch.clientY - startPos.y;

    if (containerRef.current && imgRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = imgRef.current.getBoundingClientRect();

      const maxX = (imgRect.width * zoom - containerRect.width) / 2;
      const maxY = (imgRect.height * zoom - containerRect.height) / 2;

      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const applyTransforms = (canvas, img) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    ctx.scale(zoom, zoom);

    ctx.drawImage(
      img,
      -img.naturalWidth / 2,
      -img.naturalHeight / 2,
      img.naturalWidth,
      img.naturalHeight
    );

    ctx.restore();
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImgSrc("");
    setCrop(undefined);
    setCompletedCrop(undefined);
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleCropSave = async () => {
    if (!completedCrop || !imgRef.current || !imgSrc) {
      return;
    }

    setIsSaving(true);

    try {
      const tempCanvas = document.createElement("canvas");
      applyTransforms(tempCanvas, imgRef.current);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      const scaleX = tempCanvas.width / imgRef.current.width;
      const scaleY = tempCanvas.height / imgRef.current.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      ctx.drawImage(
        tempCanvas,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );

      const blob = await new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
      });

      if (!blob) {
        throw new Error("Failed to create blob");
      }

      const croppedFile = new File([blob], "cropped-image.jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      handleFileChange(croppedFile);
      setShowCropModal(false);
      setImgSrc("");
      setRotation(0);
      setFlipHorizontal(false);
      setFlipVertical(false);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    } catch (error) {
      console.error("Error saving cropped image:", error);
      setErrorMessage("Failed to save cropped image");
    } finally {
      setIsSaving(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    // Validate file type
    if (mediaType === "image" && !file.type.startsWith("image/")) {
      setErrorMessage("Only image files are allowed");
      return;
    }
    if (mediaType === "video" && !file.type.startsWith("video/")) {
      setErrorMessage("Only video files are allowed");
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setErrorMessage(
        `File size must be less than ${maxSize / (1024 * 1024)}MB`
      );
      return;
    }

    if (enableCrop && file.type.startsWith("image/")) {
      setImgSrc(URL.createObjectURL(file));
      setShowCropModal(true);
      return;
    }

    handleFileChange(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      setErrorMessage(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0].code === "file-too-large") {
          setErrorMessage(
            `File is too large. Max size is ${maxSize / (1024 * 1024)}MB`
          );
        } else if (rejection.errors[0].code === "file-invalid-type") {
          setErrorMessage(
            `Invalid file type. Please upload ${
              mediaType === "any" ? "an image or video" : `a ${mediaType}`
            }`
          );
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0]);
      }
    },
    accept: getAcceptTypes(),
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
    disabled: uploadStatus === "uploading",
    onDragEnter: onBlur,
    onDragLeave: onBlur,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
    setUploadStatus("idle");
    setErrorMessage(null);
    if (onFileChange) {
      onFileChange(null);
    }
  };

  const isVideo = (file) => {
    if (!file) return false;
    if (typeof file === "string") {
      return file.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
    }
    return file.type.startsWith("video/");
  };

  const isVideoUrl = (url) => {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const getSupportedTypesText = () => {
    switch (mediaType) {
      case "image":
        return "Supports: JPEG, PNG, GIF, WEBP";
      case "video":
        return "Supports: MP4, WebM, OGG, MOV";
      case "any":
      default:
        return "Supports: Images and Videos";
    }
  };

  const renderUploadIcon = () => {
    switch (uploadStatus) {
      case "uploading":
        return <CircularProgress size={32} color="primary" />;
      case "success":
        return <CheckCircleIcon sx={{ fontSize: 32, color: "success.main" }} />;
      case "error":
        return <ErrorIcon sx={{ fontSize: 32, color: "error.main" }} />;
      default:
        return <UploadIcon sx={{ fontSize: 32, color: "text.secondary" }} />;
    }
  };

  const renderUploadText = () => {
    if (uploadStatus === "uploading") {
      return "Uploading file...";
    } else if (isDragActive) {
      return "Drop the file here...";
    } else if (preview) {
      return "Click to change file or drag a new one";
    } else {
      return "Drag & drop a file here, or click to select";
    }
  };

  const resetTransforms = () => {
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Box className={containerClassName}>
      {label && (
        <FormLabel className={labelClassName} sx={{ mb: 1, display: "block" }}>
          {label}
        </FormLabel>
      )}

      <DropzoneContainer
        {...getRootProps()}
        isDragActive={isDragActive}
        hasError={!!error || !!errorMessage}
        hasPreview={!!preview}
        className={className}
        elevation={0}
      >
        <input {...getInputProps()} />

        {preview && (
          <PreviewContainer className={previewClassName}>
            {isVideo(value) ||
            (initialPreview && isVideoUrl(initialPreview)) ? (
              <PreviewVideo controls src={preview} />
            ) : (
              <PreviewMedia src={preview} alt="Preview" />
            )}
            <DeleteButton
              className="delete-button"
              onClick={handleRemove}
              disabled={uploadStatus === "uploading"}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </DeleteButton>
          </PreviewContainer>
        )}

        <OverlayContent hasPreview={!!preview}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
          >
            {!preview && renderUploadIcon()}

            <Typography
              variant="body2"
              color={uploadStatus === "uploading" ? "primary" : "textPrimary"}
              sx={{ fontWeight: preview ? 600 : "normal" }}
            >
              {renderUploadText()}
            </Typography>

            {!preview && (
              <Typography variant="caption" color="textSecondary">
                {getSupportedTypesText()}
                {maxSize && ` (Max ${maxSize / (1024 * 1024)}MB)`}
              </Typography>
            )}
          </Box>
        </OverlayContent>
      </DropzoneContainer>

      {(error?.message || errorMessage) && (
        <FormHelperText error className={errorClassName} sx={{ mt: 1 }}>
          {error?.message || errorMessage}
        </FormHelperText>
      )}

      {description && !error?.message && !errorMessage && !preview && (
        <FormHelperText className={descriptionClassName} sx={{ mt: 1 }}>
          {description}
        </FormHelperText>
      )}

      <Dialog
        open={showCropModal}
        onClose={handleCropCancel}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "95vw",
            height: "90vh",
            maxWidth: "95vw",
            maxHeight: "90vh",
            m: 1,
          },
        }}
      >
        <DialogTitle>Edit Image</DialogTitle>

        <CropDialogContent>
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            height="100%"
          >
            <ToolsPanel>
              <Box sx={{ minWidth: 120 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="caption" fontWeight="medium">
                    Zoom
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {Math.round(zoom * 100)}%
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    size="small"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOutIcon fontSize="small" />
                  </IconButton>
                  <Slider
                    value={zoom}
                    onChange={handleZoomChange}
                    min={0.5}
                    max={3}
                    step={0.1}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                  >
                    <ZoomInIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ minWidth: 120 }}>
                <Typography
                  variant="caption"
                  fontWeight="medium"
                  display="block"
                  mb={1}
                >
                  Rotate
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleLeftRotate}
                    startIcon={<RotateLeftIcon />}
                    sx={{ flex: 1, minWidth: 0 }}
                  >
                    -90°
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleRightRotate}
                    startIcon={<RotateRightIcon />}
                    sx={{ flex: 1, minWidth: 0 }}
                  >
                    +90°
                  </Button>
                </Box>
              </Box>

              <Box sx={{ minWidth: 120 }}>
                <Typography
                  variant="caption"
                  fontWeight="medium"
                  display="block"
                  mb={1}
                >
                  Flip
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    variant={flipHorizontal ? "contained" : "outlined"}
                    size="small"
                    onClick={handleFlipHorizontal}
                    sx={{ flex: 1, minWidth: 0 }}
                  >
                    <FlipHorizontalIcon />
                  </Button>
                  <Button
                    variant={flipVertical ? "contained" : "outlined"}
                    size="small"
                    onClick={handleFlipVertical}
                    sx={{ flex: 1, minWidth: 0 }}
                  >
                    <FlipVerticalIcon />
                  </Button>
                </Box>
              </Box>

              <Button
                variant="text"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={resetTransforms}
                sx={{ mt: 1 }}
              >
                Reset
              </Button>
            </ToolsPanel>

            <ImageContainer
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              sx={{
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
              }}
            >
              {imgSrc && (
                <Box
                  sx={{ position: "relative", width: "100%", height: "100%" }}
                >
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={handleCropComplete}
                    aspect={cropAspectRatio}
                    minWidth={minWidth}
                    minHeight={minHeight}
                    circularCrop={circularCrop}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: theme.shape.borderRadius,
                    }}
                  >
                    <Box
                      sx={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        transition: isDragging
                          ? "none"
                          : "transform 0.2s ease-out",
                      }}
                    >
                      <img
                        ref={imgRef}
                        src={imgSrc}
                        alt="Crop preview"
                        onLoad={onImageLoad}
                        style={{
                          display: "block",
                          maxWidth: "100%",
                          maxHeight: "60vh",
                          transform: `
                            rotate(${rotation}deg)
                            scaleX(${flipHorizontal ? -1 : 1})
                            scaleY(${flipVertical ? -1 : 1})
                            scale(${zoom})
                          `,
                          transition: "transform 0.2s ease-out",
                        }}
                        draggable="false"
                      />
                    </Box>
                  </ReactCrop>
                </Box>
              )}
            </ImageContainer>
          </Box>
        </CropDialogContent>

        <Divider />
        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Box>
            {completedCrop && (
              <Typography variant="caption" color="textSecondary">
                Selection: {Math.round(completedCrop.width)}×
                {Math.round(completedCrop.height)}
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Button onClick={handleCropCancel}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCropSave}
              disabled={!completedCrop || isSaving}
              startIcon={isSaving ? <CircularProgress size={16} /> : null}
            >
              {isSaving ? "Applying..." : "Apply Changes"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <canvas ref={previewCanvasRef} style={{ display: "none" }} />
    </Box>
  );
};
