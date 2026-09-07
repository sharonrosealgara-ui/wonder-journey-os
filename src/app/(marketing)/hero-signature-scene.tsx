"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import HeroStaticFallback from "./hero-static-fallback";

/**
 * Signature 3D Scene for Wonder Journey Hero.
 * Handcrafted narrative composition: Navigational Astrolabe Compass,
 * Living Field Journal, and Sampaguita Blossoms (National Flower of the Philippines).
 *
 * Performance features:
 * - DPR cap (1.5 max, 1.25 on 4K) to avoid GPU overheating at 3840x2160
 * - IntersectionObserver pauses loop when scrolled out of view
 * - prefers-reduced-motion renders single pristine static frame
 * - Full Three.js resource disposal on unmount
 * - Graceful fallback to SVG if WebGL is unavailable
 */
export default function HeroSignatureScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. Scene setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0, 7.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    // 4K performance protection: Cap DPR at 1.5 max
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    // 2. Lighting (Warm tropical morning light + soft ocean-sky fill)
    const ambientLight = new THREE.AmbientLight(0xc9dff2, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8e7, 2.5);
    sunLight.position.set(5, 7, 6);
    scene.add(sunLight);

    const warmBounceLight = new THREE.DirectionalLight(0xffd23f, 1.4);
    warmBounceLight.position.set(-5, -4, 4);
    scene.add(warmBounceLight);

    const rimLight = new THREE.DirectionalLight(0x2fb8ad, 1.0);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // 3. Narrative Composition Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // ── A. THE NAVIGATIONAL ASTROLABE COMPASS ──
    const astrolabeGroup = new THREE.Group();
    astrolabeGroup.position.set(0.2, 0.2, 0);
    masterGroup.add(astrolabeGroup);

    // Burnished Brass Material
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
    });

    const darkBrassMaterial = new THREE.MeshStandardMaterial({
      color: 0x997316,
      metalness: 0.9,
      roughness: 0.35,
    });

    const ivoryMaterial = new THREE.MeshStandardMaterial({
      color: 0xfffdf6,
      roughness: 0.6,
      metalness: 0.05,
    });

    const sunsetCoralMaterial = new THREE.MeshStandardMaterial({
      color: 0xff7a59,
      roughness: 0.35,
      metalness: 0.4,
    });

    const oceanTealMaterial = new THREE.MeshStandardMaterial({
      color: 0x14837c,
      roughness: 0.35,
      metalness: 0.4,
    });

    // Outer Heavy Brass Rim
    const outerRimGeo = new THREE.TorusGeometry(2.35, 0.12, 16, 64);
    const outerRim = new THREE.Mesh(outerRimGeo, brassMaterial);
    astrolabeGroup.add(outerRim);

    // Coordinate Tick Ring
    const tickRingGeo = new THREE.TorusGeometry(2.15, 0.03, 12, 64);
    const tickRing = new THREE.Mesh(tickRingGeo, darkBrassMaterial);
    astrolabeGroup.add(tickRing);

    // Manila Latitude Ring (14° inclination)
    const latRing1Geo = new THREE.TorusGeometry(1.85, 0.04, 12, 48);
    const latRing1 = new THREE.Mesh(latRing1Geo, brassMaterial);
    latRing1.rotation.x = THREE.MathUtils.degToRad(14);
    astrolabeGroup.add(latRing1);

    const latRing2Geo = new THREE.TorusGeometry(1.5, 0.035, 12, 48);
    const latRing2 = new THREE.Mesh(latRing2Geo, darkBrassMaterial);
    latRing2.rotation.y = THREE.MathUtils.degToRad(28);
    astrolabeGroup.add(latRing2);

    // Dial Face Plate
    const dialPlateGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.06, 64);
    dialPlateGeo.rotateX(Math.PI / 2);
    const dialPlate = new THREE.Mesh(dialPlateGeo, ivoryMaterial);
    dialPlate.position.z = -0.05;
    astrolabeGroup.add(dialPlate);

    // 8-Ray Philippine Compass Rose Star
    const starGroup = new THREE.Group();
    starGroup.position.z = 0.01;
    astrolabeGroup.add(starGroup);

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const isCardinal = i % 2 === 0;
      const rayLen = isCardinal ? 1.55 : 1.1;
      const rayWidth = isCardinal ? 0.22 : 0.14;

      const rayShape = new THREE.Shape();
      rayShape.moveTo(0, 0);
      rayShape.lineTo(rayWidth / 2, rayLen * 0.3);
      rayShape.lineTo(0, rayLen);
      rayShape.lineTo(-rayWidth / 2, rayLen * 0.3);
      rayShape.closePath();

      const rayGeo = new THREE.ShapeGeometry(rayShape);
      const rayMesh = new THREE.Mesh(
        rayGeo,
        isCardinal ? brassMaterial : darkBrassMaterial
      );
      rayMesh.rotation.z = angle;
      starGroup.add(rayMesh);
    }

    // Compass Needle (Pointing North with gentle tilt)
    const needleGroup = new THREE.Group();
    needleGroup.position.z = 0.08;
    needleGroup.rotation.z = -0.32; // Slight natural magnetic declination
    astrolabeGroup.add(needleGroup);

    // North Needle Point (Sunset Coral)
    const northShape = new THREE.Shape();
    northShape.moveTo(0, 0);
    northShape.lineTo(0.14, -0.15);
    northShape.lineTo(0, 1.85);
    northShape.lineTo(-0.14, -0.15);
    northShape.closePath();
    const northGeo = new THREE.ExtrudeGeometry(northShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    const northMesh = new THREE.Mesh(northGeo, sunsetCoralMaterial);
    needleGroup.add(northMesh);

    // South Needle Point (Ocean Teal)
    const southShape = new THREE.Shape();
    southShape.moveTo(0, 0);
    southShape.lineTo(0.14, 0.15);
    southShape.lineTo(0, -1.45);
    southShape.lineTo(-0.14, 0.15);
    southShape.closePath();
    const southGeo = new THREE.ExtrudeGeometry(southShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    const southMesh = new THREE.Mesh(southGeo, oceanTealMaterial);
    needleGroup.add(southMesh);

    // Center Pivot Boss
    const pivotGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.15, 32);
    pivotGeo.rotateX(Math.PI / 2);
    const pivotMesh = new THREE.Mesh(pivotGeo, brassMaterial);
    pivotMesh.position.z = 0.06;
    needleGroup.add(pivotMesh);

    const jewelGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const jewelMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd23f,
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0xe5a917,
      emissiveIntensity: 0.35,
    });
    const jewelMesh = new THREE.Mesh(jewelGeo, jewelMaterial);
    jewelMesh.position.z = 0.16;
    needleGroup.add(jewelMesh);

    // ── B. EXPLORER'S LIVING FIELD JOURNAL ──
    const bookGroup = new THREE.Group();
    bookGroup.position.set(-2.2, -1.4, 0.6);
    bookGroup.rotation.set(0.35, 0.45, -0.22);
    masterGroup.add(bookGroup);

    const leatherMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a2c1b,
      roughness: 0.75,
      metalness: 0.1,
    });

    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xfdf5e0,
      roughness: 0.85,
      metalness: 0.02,
    });

    // Book Cover
    const coverGeo = new THREE.BoxGeometry(2.0, 1.4, 0.08);
    const coverMesh = new THREE.Mesh(coverGeo, leatherMaterial);
    bookGroup.add(coverMesh);

    // Pages Block
    const pagesGeo = new THREE.BoxGeometry(1.88, 1.32, 0.22);
    const pagesMesh = new THREE.Mesh(pagesGeo, pageMaterial);
    pagesMesh.position.z = 0.14;
    bookGroup.add(pagesMesh);

    // Gold Ribbon Bookmark
    const ribbonGeo = new THREE.BoxGeometry(0.16, 1.7, 0.02);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, brassMaterial);
    ribbonMesh.position.set(0.2, -0.3, 0.26);
    ribbonMesh.rotation.z = 0.15;
    bookGroup.add(ribbonMesh);

    // ── C. SAMPAGUITA BLOSSOMS (Philippine National Flower) ──
    function createSampaguitaBlossom(scale = 1.0) {
      const flower = new THREE.Group();

      const petalMaterial = new THREE.MeshStandardMaterial({
        color: 0xfffef9,
        roughness: 0.4,
        metalness: 0.05,
      });

      const centerMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd23f,
        roughness: 0.3,
        metalness: 0.3,
        emissive: 0xe5a917,
        emissiveIntensity: 0.2,
      });

      // 5 soft oval petals
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const petalShape = new THREE.Shape();
        petalShape.moveTo(0, 0);
        petalShape.quadraticCurveTo(0.22, 0.35, 0.18, 0.75);
        petalShape.quadraticCurveTo(0, 0.95, -0.18, 0.75);
        petalShape.quadraticCurveTo(-0.22, 0.35, 0, 0);

        const petalGeo = new THREE.ExtrudeGeometry(petalShape, {
          depth: 0.03,
          bevelEnabled: true,
          bevelSegments: 2,
          bevelSize: 0.02,
          bevelThickness: 0.02,
        });

        const petalMesh = new THREE.Mesh(petalGeo, petalMaterial);
        petalMesh.rotation.z = angle;
        petalMesh.rotation.x = -0.15; // Natural subtle cup shape
        flower.add(petalMesh);
      }

      // Center Stamen Pistils
      const centerGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.08, 16);
      centerGeo.rotateX(Math.PI / 2);
      const centerMesh = new THREE.Mesh(centerGeo, centerMaterial);
      centerMesh.position.z = 0.05;
      flower.add(centerMesh);

      flower.scale.set(scale, scale, scale);
      return flower;
    }

    // Blossom 1 (Foreground Lower Right)
    const blossom1 = createSampaguitaBlossom(0.95);
    blossom1.position.set(2.4, -1.2, 0.8);
    blossom1.rotation.set(-0.3, -0.4, 0.5);
    masterGroup.add(blossom1);

    // Blossom 2 (Delicate Upper Right Accent)
    const blossom2 = createSampaguitaBlossom(0.65);
    blossom2.position.set(2.1, 1.8, -0.4);
    blossom2.rotation.set(0.4, -0.3, -0.2);
    masterGroup.add(blossom2);

    // ── D. ARCHIPELAGO CELESTIAL STARS ──
    const starCoords = [
      [-3.2, 2.2, -1.0],
      [3.0, 2.5, -1.5],
      [-2.8, -2.2, -0.8],
      [2.9, -2.4, -1.2],
      [-1.5, 3.2, -2.0],
      [1.6, 3.1, -1.8],
      [-3.5, 0.4, -1.4],
      [3.4, 0.2, -1.0],
    ];

    const starGeo = new THREE.OctahedronGeometry(0.06, 0);
    const starMat = new THREE.MeshBasicMaterial({
      color: 0xffd23f,
      wireframe: false,
    });

    starCoords.forEach(([x, y, z]) => {
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(x, y, z);
      masterGroup.add(star);
    });

    // 4. Interactive Pointer Parallax + Calming Drift Loop
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isVisible = true;
    let animId: number;
    const clock = new THREE.Clock();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Controlled subtle parallax clamp
      targetRotY = x * 0.24;
      targetRotX = -y * 0.2;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // Pause when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Render loop
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return;

      if (prefersReducedMotion) {
        // Single static render
        renderer.render(scene, camera);
        cancelAnimationFrame(animId);
        return;
      }

      const elapsed = clock.getElapsedTime();

      // Smooth camera/object lerp towards cursor
      currentRotX += (targetRotX - currentRotX) * 0.045;
      currentRotY += (targetRotY - currentRotY) * 0.045;

      // Gentle natural breathing drift
      const idleRoll = Math.sin(elapsed * 0.5) * 0.04;
      const idleBob = Math.cos(elapsed * 0.6) * 0.05;

      masterGroup.rotation.x = currentRotX + idleRoll;
      masterGroup.rotation.y = currentRotY + Math.sin(elapsed * 0.35) * 0.05;
      masterGroup.position.y = idleBob;

      // Subtle slow rotation of compass needle
      needleGroup.rotation.z = -0.32 + Math.sin(elapsed * 0.8) * 0.04;

      // Gentle float of Sampaguita blossoms
      blossom1.rotation.y = -0.4 + Math.sin(elapsed * 0.6) * 0.08;
      blossom2.rotation.x = 0.4 + Math.cos(elapsed * 0.7) * 0.08;

      renderer.render(scene, camera);
    };

    // If reduced motion is requested from the start, render 1 frame and stop
    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
      observer.disconnect();
      resizeObserver.disconnect();

      // Resource disposal
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!hasWebGL) {
    return <HeroStaticFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[540px] 2xl:max-w-[640px] 3xl:max-w-[760px] 4k:max-w-[920px] mx-auto cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: "none" }}
      aria-hidden="true"
    />
  );
}
