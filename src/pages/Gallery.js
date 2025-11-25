import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import './Gallery.css';

gsap.registerPlugin(Draggable, Flip, CustomEase);

// Site-related images
const SITE_IMAGES = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Team
    "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Commerce
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Dashboard
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // WebGL
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", // Marketing
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", // Tech
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop", // Team working
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80", // Portrait
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80", // Portrait
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80", // Portrait
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80", // Portrait
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80", // Portrait
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80", // Portrait
    "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"  // Repeat
];

const IMAGE_DATA = [
    { number: "01", title: "Digital Strategy", description: "We map the territory before we build the road. Every pixel serves a purpose." },
    { number: "02", title: "Creative Process", description: "Chaos refined into clarity. We iterate until the solution feels inevitable." },
    { number: "03", title: "Technical Excellence", description: "Code that scales. Performance that converts. No compromises." },
    { number: "04", title: "Immersive WebGL", description: "Pushing the browser to its limits. Experiences that linger in memory." },
    { number: "05", title: "Growth Marketing", description: "Data-driven campaigns that find your audience and speak their language." },
    { number: "06", title: "Global Network", description: "Connecting brands with customers across borders and time zones." },
    { number: "07", title: "Team Synergy", description: "Collaboration is our superpower. We build better together." },
    { number: "08", title: "Leadership", description: "Guiding projects with vision and precision." },
    { number: "09", title: "Innovation", description: "Staying ahead of the curve so you don't have to." },
    { number: "10", title: "Design Systems", description: "Scalable UI kits that ensure consistency across all touchpoints." },
    { number: "11", title: "User Experience", description: "Empathy translated into interface. We design for humans." },
    { number: "12", title: "Agile Delivery", description: "Fast, iterative, and transparent. We ship value, not just code." },
    { number: "13", title: "Client Success", description: "Your wins are our wins. We're partners in your growth." },
    { number: "14", title: "Future Ready", description: "Building for today with tomorrow in mind." }
];

export default function Gallery() {
    const galleryRef = useRef(null);

    useEffect(() => {
        // Add gallery-mode class to body
        document.body.classList.add('gallery-mode');

        // --- Preloader Logic ---
        class PreloaderManager {
            constructor() {
                this.overlay = null;
                this.canvas = null;
                this.ctx = null;
                this.animationId = null;
                this.startTime = null;
                this.duration = 2000;
                this.createLoadingScreen();
            }

            createLoadingScreen() {
                this.overlay = document.getElementById("preloader-overlay");
                if (!this.overlay) return;

                this.canvas = document.createElement("canvas");
                this.canvas.width = 300;
                this.canvas.height = 300;
                this.ctx = this.canvas.getContext("2d");
                this.overlay.appendChild(this.canvas);
                this.startAnimation();
            }

            startAnimation() {
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                let time = 0;
                let lastTime = 0;
                const dotRings = [
                    { radius: 20, count: 8 },
                    { radius: 35, count: 12 },
                    { radius: 50, count: 16 },
                    { radius: 65, count: 20 },
                    { radius: 80, count: 24 }
                ];
                const colors = { primary: "#2C1B14", accent: "#A64B23" };
                const hexToRgb = (hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

                const animate = (timestamp) => {
                    if (!this.startTime) this.startTime = timestamp;
                    if (!lastTime) lastTime = timestamp;
                    const deltaTime = timestamp - lastTime;
                    lastTime = timestamp;
                    time += deltaTime * 0.001;
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                    this.ctx.beginPath();
                    this.ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
                    const rgb = hexToRgb(colors.primary);
                    this.ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.9)`;
                    this.ctx.fill();

                    dotRings.forEach((ring, ringIndex) => {
                        for (let i = 0; i < ring.count; i++) {
                            const angle = (i / ring.count) * Math.PI * 2;
                            const radiusPulse = Math.sin(time * 2 - ringIndex * 0.4) * 3;
                            const x = centerX + Math.cos(angle) * (ring.radius + radiusPulse);
                            const y = centerY + Math.sin(angle) * (ring.radius + radiusPulse);
                            const opacityWave = 0.4 + Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) * 0.6;
                            const isActive = Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) > 0.6;

                            this.ctx.beginPath();
                            this.ctx.moveTo(centerX, centerY);
                            this.ctx.lineTo(x, y);
                            this.ctx.lineWidth = 0.8;
                            if (isActive) {
                                const accentRgb = hexToRgb(colors.accent);
                                this.ctx.strokeStyle = `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, ${opacityWave * 0.7})`;
                            } else {
                                const primaryRgb = hexToRgb(colors.primary);
                                this.ctx.strokeStyle = `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, ${opacityWave * 0.5})`;
                            }
                            this.ctx.stroke();

                            this.ctx.beginPath();
                            this.ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                            if (isActive) {
                                const accentRgb = hexToRgb(colors.accent);
                                this.ctx.fillStyle = `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, ${opacityWave})`;
                            } else {
                                const primaryRgb = hexToRgb(colors.primary);
                                this.ctx.fillStyle = `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, ${opacityWave})`;
                            }
                            this.ctx.fill();
                        }
                    });

                    if (timestamp - this.startTime >= this.duration) {
                        this.complete();
                        return;
                    }
                    this.animationId = requestAnimationFrame(animate);
                };
                this.animationId = requestAnimationFrame(animate);
            }

            complete(onComplete) {
                if (this.animationId) cancelAnimationFrame(this.animationId);
                if (this.overlay) {
                    this.overlay.style.opacity = "0";
                    this.overlay.style.transition = "opacity 0.8s ease";
                    setTimeout(() => {
                        this.overlay?.remove();
                        if (onComplete) onComplete();
                    }, 800);
                }
            }
        }

        // --- Gallery Logic ---
        class FashionGallery {
            constructor() {
                this.viewport = document.getElementById("viewport");
                this.canvasWrapper = document.getElementById("canvasWrapper");
                this.gridContainer = document.getElementById("gridContainer");
                this.splitScreenContainer = document.getElementById("splitScreenContainer");
                this.imageTitleOverlay = document.getElementById("imageTitleOverlay");
                this.closeButton = document.getElementById("closeButton");
                this.nextButton = document.getElementById("nextButton");
                this.prevButton = document.getElementById("prevButton");
                this.controlsContainer = document.getElementById("controlsContainer");
                this.soundToggle = document.getElementById("soundToggle");
                this.customEase = CustomEase.create("smooth", ".87,0,.13,1");
                this.centerEase = CustomEase.create("center", ".25,.46,.45,.94");
                this.config = { itemSize: 320, baseGap: 16, rows: 8, cols: 12, currentZoom: 0.6, currentGap: 32 };
                this.zoomState = { isActive: false, selectedItem: null, flipAnimation: null, scalingOverlay: null };
                this.gridItems = [];
                this.gridDimensions = {};
                this.lastValidPosition = { x: 0, y: 0 };
                this.draggable = null;
                this.viewportObserver = null;
                this.initSoundSystem();
                this.initImageData();
            }

            initSoundSystem() {
                this.soundSystem = {
                    enabled: false,
                    sounds: {
                        click: new Audio("https://assets.codepen.io/7558/glitch-fx-001.mp3"),
                        open: new Audio("https://assets.codepen.io/7558/click-glitch-001.mp3"),
                        close: new Audio("https://assets.codepen.io/7558/click-glitch-001.mp3"),
                        "zoom-in": new Audio("https://assets.codepen.io/7558/whoosh-fx-001.mp3"),
                        "zoom-out": new Audio("https://assets.codepen.io/7558/whoosh-fx-001.mp3"),
                        "drag-start": new Audio("https://assets.codepen.io/7558/preloader-2s-001.mp3"),
                        "drag-end": new Audio("https://assets.codepen.io/7558/preloader-2s-001.mp3")
                    },
                    play: (soundName) => {
                        if (!this.soundSystem.enabled || !this.soundSystem.sounds[soundName]) return;
                        try {
                            const audio = this.soundSystem.sounds[soundName];
                            audio.currentTime = 0;
                            audio.play().catch(() => { });
                        } catch (e) { }
                    },
                    toggle: () => {
                        this.soundSystem.enabled = !this.soundSystem.enabled;
                        this.soundToggle.classList.toggle("active", this.soundSystem.enabled);
                        if (this.zoomState.isActive) return;
                        if (this.soundSystem.enabled) setTimeout(() => this.soundSystem.play("click"), 50);
                    }
                };
                Object.values(this.soundSystem.sounds).forEach((audio) => { audio.preload = "auto"; audio.volume = 0.3; });
                this.initSoundWave();
            }

            initSoundWave() {
                const canvas = document.getElementById("soundWaveCanvas");
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                const width = 32; const height = 16; const centerY = Math.floor(height / 2);
                let startTime = Date.now();
                let currentAmplitude = this.soundSystem.enabled ? 1 : 0;
                const interpolateColor = (c1, c2, f) => {
                    const r1 = parseInt(c1.slice(1, 3), 16), g1 = parseInt(c1.slice(3, 5), 16), b1 = parseInt(c1.slice(5, 7), 16);
                    const r2 = parseInt(c2.slice(1, 3), 16), g2 = parseInt(c2.slice(3, 5), 16), b2 = parseInt(c2.slice(5, 7), 16);
                    const r = Math.round(r1 + f * (r2 - r1)).toString(16).padStart(2, '0');
                    const g = Math.round(g1 + f * (g2 - g1)).toString(16).padStart(2, '0');
                    const b = Math.round(b1 + f * (b2 - b1)).toString(16).padStart(2, '0');
                    return `#${r}${g}${b}`;
                };
                const animate = () => {
                    const targetAmplitude = this.soundSystem.enabled ? 1 : 0;
                    currentAmplitude += (targetAmplitude - currentAmplitude) * 0.08;
                    ctx.clearRect(0, 0, width, height);
                    const time = (Date.now() - startTime) / 1000;
                    const muteFactor = 1 - currentAmplitude;
                    const primaryColor = "#2C1B14"; const accentColor = "#A64B23"; const muteColor = "#D9C4AA";
                    if (!this.soundSystem.enabled && currentAmplitude < 0.01) {
                        ctx.fillStyle = muteColor;
                        ctx.fillRect(0, centerY, width, 2);
                    } else {
                        ctx.fillStyle = interpolateColor(primaryColor, muteColor, muteFactor);
                        for (let i = 0; i < width; i++) {
                            const x = i - width / 2;
                            const e = Math.exp((-x * x) / 50);
                            const y = centerY + Math.cos(x * 0.4 - time * 8) * e * height * 0.35 * currentAmplitude;
                            ctx.fillRect(i, Math.round(y), 1, 2);
                        }
                        ctx.fillStyle = interpolateColor(accentColor, muteColor, muteFactor);
                        for (let i = 0; i < width; i++) {
                            const x = i - width / 2;
                            const e = Math.exp((-x * x) / 80);
                            const y = centerY + Math.cos(x * 0.3 - time * 5) * e * height * 0.25 * currentAmplitude;
                            ctx.fillRect(i, Math.round(y), 1, 2);
                        }
                    }
                    requestAnimationFrame(animate);
                };
                animate();
            }

            initImageData() {
                this.fashionImages = SITE_IMAGES;
                this.imageData = IMAGE_DATA;
            }

            splitTextIntoLines(element, text) {
                element.innerHTML = "";
                const sentences = text.split(/(?<=[.!?])\s+/);
                const lines = [];
                const temp = document.createElement("div");
                temp.style.cssText = `position: absolute; visibility: hidden; width: ${element.offsetWidth}px; font-family: 'PPNeueMontreal', sans-serif; font-size: 16px; font-weight: 300; line-height: 1.4;`;
                document.body.appendChild(temp);
                let currentLine = "";
                sentences.forEach((sentence) => {
                    const words = sentence.split(" ");
                    words.forEach((word) => {
                        const testLine = currentLine ? `${currentLine} ${word}` : word;
                        temp.textContent = testLine;
                        if (temp.offsetWidth > element.offsetWidth && currentLine) {
                            lines.push(currentLine);
                            currentLine = word;
                        } else {
                            currentLine = testLine;
                        }
                    });
                });
                if (currentLine) lines.push(currentLine);
                document.body.removeChild(temp);
                lines.forEach((lineText) => {
                    const lineSpan = document.createElement("span");
                    lineSpan.className = "description-line";
                    lineSpan.textContent = lineText;
                    element.appendChild(lineSpan);
                });
                return element.querySelectorAll(".description-line");
            }

            calculateGapForZoom(zoomLevel) {
                if (zoomLevel >= 1.0) return 16;
                else if (zoomLevel >= 0.6) return 32;
                else return 64;
            }

            calculateGridDimensions(gap = this.config.currentGap) {
                const totalWidth = this.config.cols * (this.config.itemSize + gap) - gap;
                const totalHeight = this.config.rows * (this.config.itemSize + gap) - gap;
                this.gridDimensions = { width: totalWidth, height: totalHeight, scaledWidth: totalWidth * this.config.currentZoom, scaledHeight: totalHeight * this.config.currentZoom, gap: gap };
                return this.gridDimensions;
            }

            generateGridItems() {
                this.config.currentGap = this.calculateGapForZoom(this.config.currentZoom);
                this.calculateGridDimensions();
                this.canvasWrapper.style.width = this.gridDimensions.width + "px";
                this.canvasWrapper.style.height = this.gridDimensions.height + "px";
                this.gridContainer.innerHTML = "";
                this.gridItems = [];

                let imageIndex = 0;
                for (let row = 0; row < this.config.rows; row++) {
                    for (let col = 0; col < this.config.cols; col++) {
                        const item = document.createElement("div");
                        item.className = "grid-item";
                        const x = col * (this.config.itemSize + this.config.currentGap);
                        const y = row * (this.config.itemSize + this.config.currentGap);
                        item.style.left = `${x}px`;
                        item.style.top = `${y}px`;
                        item.style.opacity = "0";

                        const imageUrl = this.fashionImages[imageIndex % this.fashionImages.length];
                        imageIndex++;
                        const img = document.createElement("img");
                        img.src = imageUrl;
                        img.alt = `Gallery Image ${imageIndex}`;
                        item.appendChild(img);
                        const itemData = { element: item, img: img, row: row, col: col, baseX: x, baseY: y, imageUrl: imageUrl, index: this.gridItems.length };
                        item.addEventListener("click", () => {
                            if (!this.zoomState.isActive) {
                                this.soundSystem.play("click");
                                this.enterZoomMode(itemData);
                            }
                        });
                        this.gridContainer.appendChild(item);
                        this.gridItems.push(itemData);
                    }
                }
            }

            setupViewportObserver() {
                if (this.viewportObserver) this.viewportObserver.disconnect();
                this.viewportObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (this.zoomState.selectedItem && entry.target === this.zoomState.selectedItem.element) return;
                        if (entry.isIntersecting) {
                            entry.target.classList.remove("out-of-view");
                            gsap.to(entry.target, { opacity: 1, duration: 0.6, ease: "power2.out" });
                        } else {
                            entry.target.classList.add("out-of-view");
                            gsap.to(entry.target, { opacity: 0.1, duration: 0.6, ease: "power2.out" });
                        }
                    });
                }, { root: null, threshold: 0.15, rootMargin: "10%" });
                this.gridItems.forEach((item) => this.viewportObserver.observe(item.element));
            }

            updateTitleOverlay(imageIndex) {
                const data = this.imageData[imageIndex % this.imageData.length];
                const numberElement = document.querySelector("#imageSlideNumber span");
                const titleElement = document.querySelector("#imageSlideTitle h1");
                const descriptionElement = document.getElementById("imageSlideDescription");
                if (numberElement && titleElement && descriptionElement) {
                    numberElement.textContent = data.number;
                    titleElement.textContent = data.title;
                    this.descriptionLines = this.splitTextIntoLines(descriptionElement, data.description);
                }
            }

            createScalingOverlay(sourceImg) {
                const overlay = document.createElement("div");
                overlay.className = "scaling-image-overlay";
                const img = document.createElement("img");
                img.src = sourceImg.src;
                img.alt = sourceImg.alt;
                overlay.appendChild(img);
                document.body.appendChild(overlay);
                const sourceRect = sourceImg.getBoundingClientRect();
                gsap.set(overlay, { left: sourceRect.left, top: sourceRect.top, width: sourceRect.width, height: sourceRect.height, opacity: 1 });
                return overlay;
            }

            enterZoomMode(selectedItemData) {
                if (this.zoomState.isActive) return;
                this.zoomState.isActive = true;
                this.zoomState.selectedItem = selectedItemData;
                this.soundSystem.play("open");
                if (this.draggable) this.draggable.disable();
                document.body.classList.add("zoom-mode");
                const splitContainer = this.splitScreenContainer;
                const zoomTarget = document.getElementById("zoomTarget");
                splitContainer.classList.add("active");
                gsap.to(splitContainer, { opacity: 1, duration: 1.2, ease: this.customEase });
                this.zoomState.scalingOverlay = this.createScalingOverlay(selectedItemData.img);
                gsap.set(selectedItemData.img, { opacity: 0 });
                this.zoomState.flipAnimation = Flip.fit(this.zoomState.scalingOverlay, zoomTarget, {
                    duration: 1.2,
                    ease: this.customEase,
                    absolute: true,
                    onComplete: () => {
                        this.updateTitleOverlay(selectedItemData.index);
                        const imageTitleOverlay = this.imageTitleOverlay;
                        gsap.set("#imageSlideNumber span", { y: 20, opacity: 0 });
                        gsap.set("#imageSlideTitle h1", { y: 60, opacity: 0 });
                        gsap.set(this.descriptionLines, { y: 80, opacity: 0 });
                        imageTitleOverlay.classList.add("active");
                        gsap.to(imageTitleOverlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
                        gsap.to("#imageSlideNumber span", { duration: 0.8, y: 0, opacity: 1, ease: this.customEase, delay: 0.1 });
                        gsap.to("#imageSlideTitle h1", { duration: 0.8, y: 0, opacity: 1, ease: this.customEase, delay: 0.15 });
                        gsap.to(this.descriptionLines, { duration: 0.8, y: 0, opacity: 1, ease: this.customEase, delay: 0.2, stagger: 0.15 });
                    }
                });
                this.controlsContainer.classList.add("split-mode");

                // Animate buttons in
                gsap.fromTo(this.closeButton, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.9 });
                this.closeButton.classList.add("active");

                gsap.fromTo(this.nextButton, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 1.0 });
                this.nextButton.classList.add("active");

                gsap.fromTo(this.prevButton, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 1.0 });
                this.prevButton.classList.add("active");

                document.getElementById("splitLeft").addEventListener("click", this.handleSplitAreaClick.bind(this));
                document.getElementById("splitRight").addEventListener("click", this.handleSplitAreaClick.bind(this));
                document.addEventListener("keydown", this.handleZoomKeys.bind(this));
            }

            handleSplitAreaClick(e) {
                if (e.target === e.currentTarget) this.exitZoomMode();
            }

            exitZoomMode() {
                if (!this.zoomState.isActive || !this.zoomState.selectedItem || !this.zoomState.scalingOverlay) return;
                this.soundSystem.play("close");
                document.removeEventListener("keydown", this.handleZoomKeys);
                const splitLeft = document.getElementById("splitLeft");
                const splitRight = document.getElementById("splitRight");
                if (splitLeft) splitLeft.removeEventListener("click", this.handleSplitAreaClick);
                if (splitRight) splitRight.removeEventListener("click", this.handleSplitAreaClick);
                const splitContainer = this.splitScreenContainer;
                const selectedElement = this.zoomState.selectedItem.element;
                const selectedImg = this.zoomState.selectedItem.img;
                if (this.zoomState.flipAnimation) this.zoomState.flipAnimation.kill();
                const overlayElement = this.imageTitleOverlay;
                gsap.to(overlayElement, { opacity: 0, duration: 0.3, ease: "power2.out" });
                gsap.to("#imageSlideNumber span", { duration: 0.4, y: -20, opacity: 0, ease: "power2.out" });
                gsap.to("#imageSlideTitle h1", { duration: 0.4, y: -60, opacity: 0, ease: "power2.out" });
                if (this.descriptionLines) {
                    gsap.to(this.descriptionLines, {
                        duration: 0.4, y: -80, opacity: 0, ease: "power2.out", stagger: -0.05, onComplete: () => {
                            overlayElement.classList.remove("active");
                            gsap.set("#imageSlideNumber span", { y: 20, opacity: 0 });
                            gsap.set("#imageSlideTitle h1", { y: 60, opacity: 0 });
                            gsap.set(this.descriptionLines, { y: 80, opacity: 0 });
                        }
                    });
                }
                gsap.to(this.closeButton, { duration: 0.3, opacity: 0, y: -20, ease: "power2.in" });
                gsap.to(this.nextButton, { duration: 0.3, opacity: 0, x: 40, ease: "power2.in" });
                gsap.to(this.prevButton, { duration: 0.3, opacity: 0, x: -40, ease: "power2.in" });
                splitContainer.classList.remove("active");
                this.controlsContainer.classList.remove("split-mode");
                gsap.to(splitContainer, { opacity: 0, duration: 0.8, ease: "power2.out" });
                Flip.fit(this.zoomState.scalingOverlay, selectedElement, {
                    duration: 1.2,
                    ease: this.customEase,
                    absolute: true,
                    onComplete: () => {
                        gsap.set(selectedImg, { opacity: 1 });
                        if (this.zoomState.scalingOverlay) {
                            document.body.removeChild(this.zoomState.scalingOverlay);
                            this.zoomState.scalingOverlay = null;
                        }
                        splitContainer.classList.remove("active");
                        document.body.classList.remove("zoom-mode");
                        this.closeButton.classList.remove("active");
                        this.nextButton.classList.remove("active");
                        this.prevButton.classList.remove("active");
                        if (this.draggable) this.draggable.enable();
                        this.zoomState.isActive = false;
                        this.zoomState.selectedItem = null;
                        this.zoomState.flipAnimation = null;
                    }
                });
                if (this.zoomState.scalingOverlay) gsap.to(this.zoomState.scalingOverlay, { opacity: 0.4, duration: 0.8, ease: "power2.out" });
            }

            handleZoomKeys(e) {
                if (!this.zoomState.isActive) return;
                if (e.key === "Escape") this.exitZoomMode();
                if (e.key === "ArrowRight") this.nextImage();
                if (e.key === "ArrowLeft") this.prevImage();
            }

            switchImage(index) {
                if (!this.zoomState.isActive || !this.zoomState.selectedItem) return;

                const nextItem = this.gridItems[index];
                const prevItem = this.zoomState.selectedItem;

                // Show the previous item back in the grid
                gsap.set(prevItem.img, { opacity: 1 });

                // Update state
                this.zoomState.selectedItem = nextItem;

                // Hide the new item in the grid
                gsap.set(nextItem.img, { opacity: 0 });

                // Update the zoomed image with a crossfade
                const overlayImg = this.zoomState.scalingOverlay.querySelector("img");

                // Animate out
                gsap.to(overlayImg, {
                    opacity: 0, duration: 0.2, ease: "power2.in", onComplete: () => {
                        // Swap source
                        overlayImg.src = nextItem.imageUrl;
                        // Animate in
                        gsap.to(overlayImg, { opacity: 1, duration: 0.3, ease: "power2.out" });
                    }
                });

                // Update text
                this.updateTitleOverlay(index);

                // Re-trigger text animations
                const imageTitleOverlay = this.imageTitleOverlay;

                gsap.set("#imageSlideNumber span", { y: 20, opacity: 0 });
                gsap.set("#imageSlideTitle h1", { y: 60, opacity: 0 });
                gsap.set(this.descriptionLines, { y: 80, opacity: 0 });

                imageTitleOverlay.classList.add("active");
                gsap.to(imageTitleOverlay, { opacity: 1, duration: 0.3, ease: "power2.out" });

                gsap.to("#imageSlideNumber span", { duration: 0.8, y: 0, opacity: 1, ease: this.customEase, delay: 0.1 });
                gsap.to("#imageSlideTitle h1", { duration: 0.8, y: 0, opacity: 1, ease: this.customEase, delay: 0.15 });
                gsap.to(this.descriptionLines, { duration: 0.8, y: 0, opacity: 1, ease: this.customEase, delay: 0.2, stagger: 0.15 });

                // Play sound
                this.soundSystem.play("click");
            }

            nextImage() {
                if (!this.zoomState.isActive || !this.zoomState.selectedItem) return;
                const currentIndex = this.zoomState.selectedItem.index;
                const nextIndex = (currentIndex + 1) % this.gridItems.length;
                this.switchImage(nextIndex);
            }

            prevImage() {
                if (!this.zoomState.isActive || !this.zoomState.selectedItem) return;
                const currentIndex = this.zoomState.selectedItem.index;
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) prevIndex = this.gridItems.length - 1;
                this.switchImage(prevIndex);
            }

            calculateBounds() {
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const { scaledWidth, scaledHeight } = this.gridDimensions;
                const marginX = this.config.currentGap * this.config.currentZoom;
                const marginY = this.config.currentGap * this.config.currentZoom;
                let minX, maxX, minY, maxY;
                if (scaledWidth <= vw) {
                    const centerX = (vw - scaledWidth) / 2;
                    minX = maxX = centerX;
                } else {
                    maxX = marginX;
                    minX = vw - scaledWidth - marginX;
                }
                if (scaledHeight <= vh) {
                    const centerY = (vh - scaledHeight) / 2;
                    minY = maxY = centerY;
                } else {
                    maxY = marginY;
                    minY = vh - scaledHeight - marginY;
                }
                return { minX, maxX, minY, maxY };
            }

            initDraggable() {
                if (this.draggable) this.draggable.kill();
                this.calculateGridDimensions(this.config.currentGap);
                const bounds = this.calculateBounds();
                this.draggable = Draggable.create(this.canvasWrapper, {
                    type: "x,y",
                    bounds: bounds,
                    edgeResistance: 0.8,
                    // inertia: true, // REMOVED as it requires InertiaPlugin
                    onDragStart: () => {
                        document.body.classList.add("dragging");
                        this.soundSystem.play("drag-start");
                        this.lastValidPosition.x = this.draggable.x;
                        this.lastValidPosition.y = this.draggable.y;
                    },
                    onDrag: () => {
                        this.lastValidPosition.x = this.draggable.x;
                        this.lastValidPosition.y = this.draggable.y;
                    },
                    onDragEnd: () => {
                        document.body.classList.remove("dragging");
                        this.soundSystem.play("drag-end");
                    }
                })[0];
            }

            handleMouseLeave() {
                if (document.body.classList.contains("dragging")) {
                    document.body.classList.remove("dragging");
                    gsap.to(this.canvasWrapper, { duration: 0.6, x: this.lastValidPosition.x, y: this.lastValidPosition.y, ease: "power2.out" });
                    if (this.draggable) this.draggable.endDrag();
                }
            }

            calculateFitZoom() {
                const vw = window.innerWidth;
                const vh = window.innerHeight - 80;
                const currentGap = this.calculateGapForZoom(1.0);
                const gridWidth = this.config.cols * (this.config.itemSize + currentGap) - currentGap;
                const gridHeight = this.config.rows * (this.config.itemSize + currentGap) - currentGap;
                const margin = 40;
                const availableWidth = vw - margin * 2;
                const availableHeight = vh - margin * 2;
                const zoomToFitWidth = availableWidth / gridWidth;
                const zoomToFitHeight = availableHeight / gridHeight;
                const fitZoom = Math.min(zoomToFitWidth, zoomToFitHeight);
                return Math.max(0.1, Math.min(2.0, fitZoom));
            }

            playIntroAnimation() {
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const screenCenterX = vw / 2;
                const screenCenterY = vh / 2;
                const canvasStyle = getComputedStyle(this.canvasWrapper);
                const canvasMatrix = new DOMMatrix(canvasStyle.transform);
                const canvasScale = canvasMatrix.a;
                const canvasX = canvasMatrix.m41;
                const canvasY = canvasMatrix.m42;
                const centerX = (screenCenterX - canvasX) / canvasScale - this.config.itemSize / 2;
                const centerY = (screenCenterY - canvasY) / canvasScale - this.config.itemSize / 2;

                this.gridItems.forEach((itemData, index) => {
                    const zIndex = this.gridItems.length - index;
                    gsap.set(itemData.element, { left: centerX, top: centerY, scale: 0.8, zIndex: zIndex, opacity: 0 });
                });

                gsap.to(this.gridItems.map((item) => item.element), {
                    duration: 0.2,
                    left: (index) => this.gridItems[index].baseX,
                    top: (index) => this.gridItems[index].baseY,
                    scale: 1,
                    opacity: 1,
                    ease: "power2.out",
                    stagger: { amount: 1.5, from: "start", grid: [this.config.rows, this.config.cols] },
                    onComplete: () => {
                        this.gridItems.forEach((itemData) => gsap.set(itemData.element, { zIndex: 1 }));
                        const percentageIndicator = this.controlsContainer.querySelector(".percentage-indicator");
                        const switchElement = this.controlsContainer.querySelector(".switch");
                        const soundToggle = this.controlsContainer.querySelector(".sound-toggle");
                        gsap.set(this.controlsContainer, { opacity: 0 });
                        gsap.set(percentageIndicator, { x: "-3em" });
                        gsap.set(switchElement, { y: "2em" });
                        gsap.set(soundToggle, { x: "3em" });
                        const navTimeline = gsap.timeline();
                        navTimeline.to(this.controlsContainer, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0);
                        navTimeline.to(percentageIndicator, { x: 0, duration: 0.2, ease: "power2.out" }, 0.25);
                        navTimeline.to(switchElement, { y: 0, duration: 0.2, ease: "power2.out" }, 0.3);
                        navTimeline.to(soundToggle, { x: 0, duration: 0.2, ease: "power2.out" }, 0.35);
                        this.controlsContainer.classList.add("visible");
                    }
                });
            }

            autoFitZoom(buttonElement = null) {
                if (this.zoomState.isActive) { this.exitZoomMode(); return; }
                const fitZoom = this.calculateFitZoom();
                this.config.currentZoom = fitZoom;
                const newGap = this.calculateGapForZoom(fitZoom);
                this.soundSystem.play(fitZoom < 0.6 ? "zoom-out" : "zoom-in");
                this.calculateGridDimensions(this.config.currentGap);
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const currentScaledWidth = this.gridDimensions.width * this.config.currentZoom;
                const currentScaledHeight = this.gridDimensions.height * this.config.currentZoom;
                const centerX = (vw - currentScaledWidth) / 2;
                const centerY = (vh - currentScaledHeight) / 2;
                gsap.to(this.canvasWrapper, {
                    duration: 0.6, x: centerX, y: centerY, ease: this.centerEase, onComplete: () => {
                        if (newGap !== this.config.currentGap) {
                            this.gridItems.forEach((itemData) => {
                                const newX = itemData.col * (this.config.itemSize + newGap);
                                const newY = itemData.row * (this.config.itemSize + newGap);
                                itemData.baseX = newX; itemData.baseY = newY;
                                gsap.to(itemData.element, { duration: 1.0, left: newX, top: newY, ease: this.customEase });
                            });
                            const newWidth = this.config.cols * (this.config.itemSize + newGap) - newGap;
                            const newHeight = this.config.rows * (this.config.itemSize + newGap) - newGap;
                            gsap.to(this.canvasWrapper, { duration: 1.0, width: newWidth, height: newHeight, ease: this.customEase });
                            this.config.currentGap = newGap;
                        }
                        this.calculateGridDimensions(newGap);
                        const finalScaledWidth = this.gridDimensions.width * fitZoom;
                        const finalScaledHeight = this.gridDimensions.height * fitZoom;
                        const finalCenterX = (vw - finalScaledWidth) / 2;
                        const finalCenterY = (vh - finalScaledHeight) / 2;
                        gsap.to(this.canvasWrapper, {
                            duration: 1.2, scale: fitZoom, x: finalCenterX, y: finalCenterY, ease: this.customEase, onComplete: () => {
                                this.lastValidPosition.x = finalCenterX; this.lastValidPosition.y = finalCenterY;
                                this.initDraggable();
                            }
                        });
                    }
                });
                this.updatePercentageIndicator(fitZoom);
                document.querySelectorAll(".switch-button").forEach((btn) => btn.classList.remove("switch-button-current"));
                if (buttonElement) buttonElement.classList.add("switch-button-current");
            }

            updatePercentageIndicator(zoomLevel) {
                const percentage = Math.round(zoomLevel * 100);
                document.getElementById("percentageIndicator").textContent = `${percentage}%`;
            }

            setZoom(zoomLevel, buttonElement = null) {
                if (this.zoomState.isActive) { this.exitZoomMode(); return; }
                const newGap = this.calculateGapForZoom(zoomLevel);
                const oldZoom = this.config.currentZoom;
                this.config.currentZoom = zoomLevel;
                this.soundSystem.play(zoomLevel < oldZoom ? "zoom-out" : "zoom-in");
                this.calculateGridDimensions(this.config.currentGap);
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const currentScaledWidth = this.gridDimensions.width * oldZoom;
                const currentScaledHeight = this.gridDimensions.height * oldZoom;
                const centerX = (vw - currentScaledWidth) / 2;
                const centerY = (vh - currentScaledHeight) / 2;
                gsap.to(this.canvasWrapper, {
                    duration: 0.6, x: centerX, y: centerY, ease: this.centerEase, onComplete: () => {
                        if (newGap !== this.config.currentGap) {
                            this.gridItems.forEach((itemData) => {
                                const newX = itemData.col * (this.config.itemSize + newGap);
                                const newY = itemData.row * (this.config.itemSize + newGap);
                                itemData.baseX = newX; itemData.baseY = newY;
                                gsap.to(itemData.element, { duration: 1.2, left: newX, top: newY, ease: this.customEase });
                            });
                            const newWidth = this.config.cols * (this.config.itemSize + newGap) - newGap;
                            const newHeight = this.config.rows * (this.config.itemSize + newGap) - newGap;
                            gsap.to(this.canvasWrapper, { duration: 1.2, width: newWidth, height: newHeight, ease: this.customEase });
                            this.config.currentGap = newGap;
                        }
                        this.calculateGridDimensions(newGap);
                        const finalScaledWidth = this.gridDimensions.width * zoomLevel;
                        const finalScaledHeight = this.gridDimensions.height * zoomLevel;
                        const finalCenterX = (vw - finalScaledWidth) / 2;
                        const finalCenterY = (vh - finalScaledHeight) / 2;
                        gsap.to(this.canvasWrapper, {
                            duration: 1.2, scale: zoomLevel, x: finalCenterX, y: finalCenterY, ease: this.customEase, onComplete: () => {
                                this.lastValidPosition.x = finalCenterX; this.lastValidPosition.y = finalCenterY;
                                this.calculateGridDimensions(newGap);
                                this.initDraggable();
                            }
                        });
                    }
                });
                this.updatePercentageIndicator(zoomLevel);
                document.querySelectorAll(".switch-button").forEach((btn) => btn.classList.remove("switch-button-current"));
                if (buttonElement) {
                    buttonElement.classList.add("switch-button-current");
                } else {
                    const buttons = document.querySelectorAll(".switch-button");
                    if (zoomLevel === 0.3) buttons[1].classList.add("switch-button-current");
                    else if (zoomLevel === 0.6) buttons[2].classList.add("switch-button-current");
                    else if (zoomLevel === 1.0) buttons[3].classList.add("switch-button-current");
                }
            }

            resetPosition() {
                if (this.zoomState.isActive) { this.exitZoomMode(); return; }
                this.calculateGridDimensions(this.config.currentGap);
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const { scaledWidth, scaledHeight } = this.gridDimensions;
                const centerX = (vw - scaledWidth) / 2;
                const centerY = (vh - scaledHeight) / 2;
                gsap.to(this.canvasWrapper, {
                    duration: 1.0, x: centerX, y: centerY, ease: this.centerEase, onComplete: () => {
                        this.lastValidPosition.x = centerX; this.lastValidPosition.y = centerY;
                        this.initDraggable();
                    }
                });
            }

            init() {
                this.config.currentGap = this.calculateGapForZoom(this.config.currentZoom);
                this.generateGridItems();
                gsap.set(this.viewport, { opacity: 0 });
                gsap.set(this.canvasWrapper, { scale: this.config.currentZoom });
                this.calculateGridDimensions(this.config.currentGap);
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const { scaledWidth, scaledHeight } = this.gridDimensions;
                const centerX = (vw - scaledWidth) / 2;
                const centerY = (vh - scaledHeight) / 2;
                gsap.set(this.canvasWrapper, { x: centerX, y: centerY });
                this.lastValidPosition.x = centerX; this.lastValidPosition.y = centerY;
                this.updatePercentageIndicator(this.config.currentZoom);
                this.setupEventListeners();
                gsap.to(this.viewport, {
                    duration: 0.6, opacity: 1, ease: "power2.inOut", onComplete: () => {
                        this.playIntroAnimation();

                        gsap.to(".gallery-footer", { duration: 1.4, opacity: 1, ease: "power2.out", delay: 1 });
                        setTimeout(() => { this.initDraggable(); this.setupViewportObserver(); }, 1500);
                    }
                });
            }

            setupEventListeners() {
                window.addEventListener("resize", () => setTimeout(() => { this.resetPosition(); this.initDraggable(); }, 100));
                document.addEventListener("mouseleave", () => this.handleMouseLeave());
                this.viewport.addEventListener("mouseleave", () => this.handleMouseLeave());
                this.closeButton.addEventListener("click", () => this.exitZoomMode());
                this.nextButton.addEventListener("click", () => this.nextImage());
                this.prevButton.addEventListener("click", () => this.prevImage());
                this.soundToggle.addEventListener("click", () => this.soundSystem.toggle());
                document.addEventListener("keydown", (e) => {
                    if (this.zoomState.isActive) return;
                    switch (e.key) {
                        case "1": this.setZoom(0.3); break;
                        case "2": this.setZoom(0.6); break;
                        case "3": this.setZoom(1.0); break;
                        case "f": case "F": this.autoFitZoom(); break;
                    }
                });
            }
        }

        // Initialize
        let galleryInstance;
        const preloader = new PreloaderManager();
        setTimeout(() => {
            preloader.complete(() => {
                galleryInstance = new FashionGallery();
                galleryInstance.init();
                // Expose to window for button clicks
                window.gallery = galleryInstance;
            });
        }, 2000);

        return () => {
            document.body.classList.remove('gallery-mode');
            if (galleryInstance) {
                // Cleanup if needed
                window.gallery = null;
            }
        };
    }, []);

    return (
        <div className="gallery-page-wrapper">
            <div id="preloader-overlay"></div>


            <div className="viewport" id="viewport">
                <div className="canvas-wrapper" id="canvasWrapper">
                    <div className="grid-container" id="gridContainer">
                    </div>
                </div>
            </div>

            <div className="split-screen-container" id="splitScreenContainer">
                <div className="split-left" id="splitLeft">
                    <div className="zoom-target" id="zoomTarget"></div>
                </div>
                <div className="split-right" id="splitRight">
                </div>
            </div>

            <div className="image-title-overlay" id="imageTitleOverlay">
                <div className="image-slide-number" id="imageSlideNumber">
                    <span>01</span>
                </div>
                <div className="image-slide-title" id="imageSlideTitle">
                    <h1>Digital Strategy</h1>
                </div>
                <div className="image-slide-description" id="imageSlideDescription">
                </div>
            </div>

            <button className="close-button" id="closeButton">
                <svg width="64" height="64" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" fill="white" />
                </svg>
            </button>

            <button className="prev-button" id="prevButton">
                <svg width="64" height="64" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.89873 16L6.35949 14.48L11.8278 9.08H0V6.92H11.8278L6.35949 1.52L7.89873 0L16 8L7.89873 16Z" fill="white" />
                </svg>
            </button>

            <button className="next-button" id="nextButton">
                <svg width="64" height="64" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.89873 16L6.35949 14.48L11.8278 9.08H0V6.92H11.8278L6.35949 1.52L7.89873 0L16 8L7.89873 16Z" fill="white" />
                </svg>
            </button>

            <div className="controls-container" id="controlsContainer">
                <div className="percentage-indicator" id="percentageIndicator">
                    60%
                </div>
                <div className="switch" id="controls">
                    <button className="switch-button" onClick={(e) => window.gallery?.setZoom(0.3, e.target)}>
                        <span className="indicator-dot"></span>
                        ZOOM OUT
                    </button>
                    <button className="switch-button switch-button-current" onClick={(e) => window.gallery?.setZoom(0.6, e.target)}>
                        <span className="indicator-dot"></span>
                        NORMAL
                    </button>
                    <button className="switch-button" onClick={(e) => window.gallery?.setZoom(1.0, e.target)}>
                        <span className="indicator-dot"></span>
                        ZOOM IN
                    </button>
                    <button className="switch-button" onClick={(e) => window.gallery?.autoFitZoom(e.target)}>
                        <span className="indicator-dot"></span>
                        FIT
                    </button>
                </div>
                <button className="sound-toggle" id="soundToggle">
                    <canvas className="sound-wave-canvas" id="soundWaveCanvas" width="32" height="16"></canvas>
                </button>
            </div>

            <div className="gallery-footer">
            </div>

            <div className="page-vignette-container">
                <div className="page-vignette-extreme"></div>
            </div>
        </div>
    );
}
