import React, { useState, useRef, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import common from "@material-ui/core/colors/common";
import { SyntheticEvent } from "react";

interface ImageProps {
  /** Duration of the fading animation, in milliseconds. */
  animationDuration?: number;
  /** Override aspect ratio. */
  aspectRatio?: number;
  /** Override the object fit to cover. */
  cover?: boolean;
  /** Override the background color. */
  color?: string;
  /** Disables the error icon if set to true. */
  disableError?: boolean;
  /** Disables the loading spinner if set to true. */
  disableSpinner?: boolean;
  /** Disables the transition after load if set to true. */
  disableTransition?: boolean;
  /** Override the error icon. */
  errorIcon?: JSX.Element;
  /** Override the inline-styles of the container that contains the loading spinner and the error icon. */
  iconContainerStyle?: React.CSSProperties;
  /** Override the inline-styles of the image. */
  imageStyle?: React.CSSProperties;
  /** Override the loading component. */
  loading?: JSX.Element;
  /** Fired when the user clicks on the image happened. */
  onClick?: any;
  /** Fired when the image failed to load. */
  onError?: any;
  /** Fired when the image finished loading. */
  onLoad?: any;
  /** Specifies the URL of an image. */
  src: string;
  /** Override the inline-styles of the root element. */
  style?: React.CSSProperties;
}

function Image({
  animationDuration = 3000,
  aspectRatio = 1,
  color = common.white,
  cover,
  disableError = false,
  disableSpinner = false,
  disableTransition = false,
  errorIcon,
  iconContainerStyle,
  imageStyle,
  loading = <CircularProgress size={48} />,
  onClick,
  style,
  ...props
}: ImageProps) {
  let image =
    useRef<HTMLImageElement>() as React.MutableRefObject<HTMLImageElement>;
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const img = image.current;
    if (img && img.complete) {
      // image loaded before the component rendered (e.g. SSR), see #43 and #51
      if (img.naturalWidth === 0) {
        handleImageError();
      } else {
        handleLoadImage();
      }
    }
  }, []);

  function getStyles() {
    const imageTransition = !disableTransition && {
      opacity: imageLoaded ? 1 : 0,
      filterBrightness: imageLoaded ? 100 : 0,
      filterSaturate: imageLoaded ? 100 : 20,
      transition: `
        filterBrightness ${
          animationDuration * 0.75
        }ms cubic-bezier(0.4, 0.0, 0.2, 1),
        filterSaturate ${animationDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1),
        opacity ${animationDuration / 2}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
    };

    const styles: Record<string, React.CSSProperties> = {
      root: {
        backgroundColor: color,
        paddingTop: `calc(1 / ${aspectRatio} * 100%)`,
        position: "relative",
        ...style,
      },
      image: {
        width: "100%",
        height: "100%",
        position: "absolute",
        objectFit: cover ? "cover" : "inherit",
        top: 0,
        left: 0,
        ...imageTransition,
        ...imageStyle,
      },
      iconContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        ...iconContainerStyle,
      },
    };

    return styles;
  }

  function handleLoadImage(e?: SyntheticEvent<HTMLImageElement>) {
    setImageLoaded(true);
    setImageError(false);
    if (props.onLoad) {
      props.onLoad(e);
    }
  }

  function handleImageError(e?: SyntheticEvent<HTMLImageElement>) {
    if (props.src) {
      setImageError(true);
      if (props.onError) {
        props.onError(e);
      }
    }
  }

  const styles = getStyles();

  return (
    <div style={styles.root} onClick={onClick}>
      {props.src && (
        <img
          {...props}
          ref={image}
          style={styles.image}
          onLoad={handleLoadImage}
          onError={handleImageError}
        />
      )}
      <div style={styles.iconContainer}>
        {!disableSpinner && !imageLoaded && !imageError && loading}
        {!disableError && imageError && errorIcon}
      </div>
    </div>
  );
}

export default Image;
