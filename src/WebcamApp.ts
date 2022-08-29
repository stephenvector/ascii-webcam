import getCharacterDimensions from "./get-character-dimensions";
import getCharacterLightnessMap from "./get-character-lightness-map";
import { Dimensions } from "./types";
import { getMultiplier } from "./get-multiplier";

export default class WebcamApp {
  active: boolean;

  rootElement: HTMLDivElement;
  videoElement: HTMLVideoElement;
  canvasElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  preElement: HTMLPreElement;
  codeElement: HTMLElement;
  buttonElement: HTMLButtonElement;

  animationFrameRequestId: number | null;

  characterDimensions: Dimensions;
  characterLightnessMap: string[];

  constructor(rootElement: HTMLDivElement) {
    this.setError = this.setError.bind(this);
    this.toggleStart = this.toggleStart.bind(this);
    this.startWebcam = this.startWebcam.bind(this);
    this.stopWebcam = this.stopWebcam.bind(this);
    this.drawVideo = this.drawVideo.bind(this);
    this.onVideoLoadedMetadata = this.onVideoLoadedMetadata.bind(this);

    this.animationFrameRequestId = null;

    this.active = false;

    this.rootElement = rootElement;
    this.preElement = document.createElement("pre");
    this.codeElement = document.createElement("code");
    this.preElement.appendChild(this.codeElement);

    // Setup a start/stop button so that the webcam doesn't automatically
    // start on page load
    this.buttonElement = document.createElement("button");
    this.buttonElement.innerText = "Start ASCII Webcam";
    this.buttonElement.type = "button";
    this.buttonElement.className = "toggleButton";
    this.buttonElement.addEventListener("click", this.toggleStart);

    // We don't append this video to the document, because we
    // don't want to actually display it, just use the data from the
    // webcam that's piped to the it, so that we can then pipe that
    // data to a canvas element. The canvas element will allow us to
    // scale the video so that we can resize it easily and access the
    // raw pixel data coming fromt the webcam.
    this.videoElement = document.createElement("video");
    this.videoElement.autoplay = true;

    // This isn't added to the document either, since it's for reading
    // the raw image data from. We could probably get by without this,
    // but it acts as a "read only" canvas, which makes it easier to/
    // work with. If it was "read/write" things might get confusing
    this.canvasElement = document.createElement("canvas");

    const canvasContext = this.canvasElement.getContext("2d");

    // If we can't get a 2D rendering context from our canvas element,
    // then we should bail early.
    if (!canvasContext) {
      throw new Error("Can't get canvas 2D context");
    }

    this.canvasContext = canvasContext;
    this.characterDimensions = getCharacterDimensions();
    this.characterLightnessMap = getCharacterLightnessMap();

    this.rootElement.appendChild(this.preElement);
    this.rootElement.appendChild(this.buttonElement);
  }

  setError(e: unknown) {}

  toggleStart() {
    this.active = !this.active;
    this.buttonElement.innerText = this.active ? "Pause" : "Start";

    if (this.active) {
      this.startWebcam();
    } else {
      if (this.animationFrameRequestId) {
        window.cancelAnimationFrame(this.animationFrameRequestId);
      }

      this.animationFrameRequestId = null;

      this.stopWebcam();
    }
  }

  onVideoLoadedMetadata() {
    this.animationFrameRequestId = window.requestAnimationFrame(this.drawVideo);
  }

  async startWebcam() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      this.videoElement.srcObject = mediaStream;
      this.videoElement.addEventListener(
        "loadedmetadata",
        this.onVideoLoadedMetadata
      );
    } catch (e) {
      this.setError(e);
    }
  }

  stopWebcam() {
    this.videoElement.pause();
  }

  drawVideo() {
    const characterAspectRatio =
      this.characterDimensions.width / this.characterDimensions.height;

    this.canvasElement.width = this.videoElement.videoWidth / 4;
    this.canvasElement.height =
      (this.videoElement.videoHeight * characterAspectRatio) / 4;

    this.canvasContext.drawImage(
      this.videoElement,
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    const frame = this.canvasContext.getImageData(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    const videoFrameCharacters = [];

    let pixelNumber = 0;
    for (let i = 0; i < frame.data.length; i += 4) {
      const r = frame.data[i];
      const g = frame.data[i + 1];
      const b = frame.data[i + 2];

      const average = Math.round((r + g + b) / 3);

      videoFrameCharacters.push(this.characterLightnessMap[average] ?? " ");

      // Add a newline if we're at the end of a row of characters
      pixelNumber++;
      if (pixelNumber % this.canvasElement.width === 0) {
        videoFrameCharacters.push("\n");
      }
    }

    this.codeElement.innerText = videoFrameCharacters.join("");

    const multiplier = getMultiplier(
      {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      },
      {
        width: this.canvasElement.width * this.characterDimensions.width,
        height: this.canvasElement.height * this.characterDimensions.height,
      }
    );

    this.preElement.style.transform = `scale(${multiplier})`;

    this.animationFrameRequestId = window.requestAnimationFrame(this.drawVideo);
  }
}
