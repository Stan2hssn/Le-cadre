import Device from "./pure/Device";
import { Vector2 } from "three";

import gsap from "gsap";

class Input {
  constructor() {
    this.coords = new Vector2();
    this.prevCoords = new Vector2();
    this.mouseMoved = false;
    this.delta = new Vector2();
    this.timer = null;
    this.count = 0;

    this.mouseVelocity = 0;

    this.velocity = 0;
  }

  init() {
    this.xTo = gsap.quickTo(this.coords, "x", {
      duration: 0.6,
      ease: "power2.out",
    });
    this.yTo = gsap.quickTo(this.coords, "y", {
      duration: 0.6,
      ease: "power2.out",
    });

    document.addEventListener(
      "mousemove",
      this.onDocumentMouseMove.bind(this),
      false,
    );
    document.addEventListener(
      "touchstart",
      this.onDocumentTouchStart.bind(this),
      { passive: false }, // Mark the listener as non-passive
    );
    document.addEventListener(
      "touchmove",
      this.onDocumentTouchMove.bind(this),
      { passive: false }, // Mark the listener as non-passive
    );
  }

  setCoords(x, y) {
    if (this.timer) clearTimeout(this.timer);

    if (!this.mouseMoved) {
      this.mouseMoved = true;
      gsap.to(this, { mouseVelocity: 0, duration: 1 });
    }

    this.xTo((x / Device.viewport.width) * 2 - 1);
    this.yTo(-(y / Device.viewport.height) * 2 + 1);

    this.mouseMoved = true;
    this.timer = setTimeout(() => {
      this.mouseMoved = false;
    }, 100);
  }

  onDocumentMouseMove(event) {
    this.setCoords(event.clientX, event.clientY);
  }

  onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.setCoords(event.touches[0].pageX, event.touches[0].pageY);
    }
  }

  onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.setCoords(event.touches[0].pageX, event.touches[0].pageY);
    }
  }

  render() {
    this.delta.subVectors(this.coords, this.prevCoords);
    this.prevCoords.copy(this.coords);

    if (this.mouseMoved) {
      gsap.to(this, { mouseVelocity: 1, duration: 0.3 });

      this.mouseMoved = false;
    }

    if (this.prevCoords.x === 0 && this.prevCoords.y === 0)
      this.delta.set(0, 0);
  }

  dispose() {}

  resize() {}
}

export default new Input();
