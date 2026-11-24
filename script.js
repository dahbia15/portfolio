document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // 1. Light / Dark Mode
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(mode) {
    if (mode === "dark") {
      body.classList.remove("light-mode");
      if (themeToggle) themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.add("light-mode");
      if (themeToggle) themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isLight = body.classList.contains("light-mode");
      applyTheme(isLight ? "dark" : "light");
    });
  }

  // 2. Switch FR / EN
  const langButtons = document.querySelectorAll(".lang-btn");
  const translatableElements = document.querySelectorAll("[data-fr][data-en]");

  function setLanguage(lang) {
    const targetLang = lang === "en" ? "en" : "fr";

    translatableElements.forEach((el) => {
      const text = el.getAttribute(`data-${targetLang}`);
      if (text !== null) {
        el.innerHTML = text;
      }
    });

    langButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === targetLang);
    });

    document.documentElement.lang = targetLang;
    document.documentElement.dir = "ltr";
    localStorage.setItem("siteLang", targetLang);
  }

  const savedLang = localStorage.getItem("siteLang") || "fr";
  setLanguage(savedLang);

  langButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedLang = btn.getAttribute("data-lang");
      setLanguage(selectedLang);
    });
  });

  // Menu mobile
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      }
    });
  }

  // 3. Scroll Reveal
  const elementsToAnimate = document.querySelectorAll(".info-card, .proof-card, .about-grid");

  elementsToAnimate.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(25px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elementsToAnimate.forEach((el) => observer.observe(el));
  } else {
    elementsToAnimate.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }

  // 4. Lightbox images
  const proofImages = document.querySelectorAll(".proof-card img");

  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  Object.assign(lightbox.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.88)",
    display: "none",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    zIndex: "9999",
    cursor: "zoom-out",
  });

  const lightboxImg = document.createElement("img");
  Object.assign(lightboxImg.style, {
    maxWidth: "92%",
    maxHeight: "85%",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  });

  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);

  proofImages.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.style.display = "flex";
    });
  });

  lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  // 5. Copie rapide e-mail
  const footerText = document.querySelector("#contact p");
  if (footerText) {
    footerText.style.cursor = "pointer";
    footerText.title = "Cliquer pour copier l'e-mail";

    footerText.addEventListener("click", () => {
      const email = "dahbiaelfajraoui@gmail.com";
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          const originalText = footerText.innerHTML;
          footerText.innerHTML = "✅ E-mail copié : <strong>" + email + "</strong>";
          setTimeout(() => {
            footerText.innerHTML = originalText;
          }, 2500);
        });
      }
    });
  }

  // 6. Shadow header au scroll
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (!header) return;
    if (window.scrollY > 50) {
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.14)";
    } else {
      header.style.boxShadow = "none";
    }
  });

  // 7. 3D Tilt (desktop uniquement)
  const tiltCards = document.querySelectorAll(".info-card, .proof-card");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (!prefersReducedMotion && !isTouchDevice) {
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
        card.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
        card.style.setProperty("--mx", `${((x / rect.width) * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${((y / rect.height) * 100).toFixed(1)}%`);
        card.classList.add("is-tilting");
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("is-tilting");
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  // 8. Avatar 3D Modal
  const avatarImg = document.querySelector(".img-avatar");
  const avatarModal = document.getElementById("avatar-modal");
  const closeModalBtn = avatarModal ? avatarModal.querySelector(".close-modal") : null;
  const threeContainer = document.getElementById("three-container");

  if (!avatarImg || !avatarModal || !threeContainer) return;

  let scene, camera, renderer, model, wavingArmGroup, halo, waveTween;
  let threeInitialized = false;
  const clock = new THREE.Clock();

  function playGreetingAnimation() {
    if (!model || !wavingArmGroup || typeof gsap === "undefined") return;

    if (waveTween) waveTween.kill();

    gsap.killTweensOf(model.rotation);
    gsap.killTweensOf(model.position);
    gsap.killTweensOf(wavingArmGroup.rotation);

    gsap.set(model.rotation, { x: 0, y: -0.2, z: 0 });
    gsap.set(model.position, { y: -0.55 });
    gsap.set(wavingArmGroup.rotation, { z: 0.25 });

    gsap.to(model.position, {
      y: -0.35,
      duration: 0.7,
      ease: "power3.out",
    });

    gsap.to(model.rotation, {
      y: 0.15,
      duration: 0.8,
      ease: "power2.out",
    });

    waveTween = gsap.to(wavingArmGroup.rotation, {
      z: 0.85,
      duration: 0.28,
      repeat: 5,
      yoyo: true,
      ease: "sine.inOut",
      onComplete: () => {
        gsap.to(wavingArmGroup.rotation, { z: 0.2, duration: 0.35 });
      },
    });
  }

  function initThree() {
    if (typeof THREE === "undefined") return;

    const width = threeContainer.clientWidth || 500;
    const height = threeContainer.clientHeight || 320;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1.15, 3.3);
    camera.lookAt(0, 1.05, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    threeContainer.innerHTML = "";
    threeContainer.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(1, 2, 3);
    scene.add(dirLight);

    model = new THREE.Group();

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85,
    });

    const warmSkinMat = new THREE.MeshStandardMaterial({
      color: 0xe6b89c,
      roughness: 0.45,
      metalness: 0.1,
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.4,
      metalness: 0.2,
    });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.68, 32, 32), warmSkinMat);
    head.scale.set(0.95, 1.05, 0.95);
    head.position.set(0, 1.35, 0);
    model.add(head);

    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.71, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.58),
      darkMat
    );
    hair.position.set(0, 1.4, -0.03);
    hair.rotation.x = -0.15;
    model.add(hair);

    const eyeGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, darkMat);
    const rightEye = new THREE.Mesh(eyeGeo, darkMat);
    leftEye.position.set(-0.22, 1.42, 0.58);
    rightEye.position.set(0.22, 1.42, 0.58);
    model.add(leftEye, rightEye);

    const smileGeo = new THREE.TorusGeometry(0.16, 0.025, 12, 24, Math.PI);
    const smile = new THREE.Mesh(smileGeo, goldMat);
    smile.position.set(0, 1.18, 0.57);
    smile.rotation.x = Math.PI + 0.15;
    model.add(smile);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.38, 0.72, 24), goldMat);
    torso.position.set(0, 0.35, 0);
    model.add(torso);

    wavingArmGroup = new THREE.Group();
    wavingArmGroup.position.set(0.42, 0.62, 0.05);

    const armGeo = THREE.CapsuleGeometry
      ? new THREE.CapsuleGeometry(0.075, 0.38, 8, 16)
      : new THREE.CylinderGeometry(0.075, 0.075, 0.45, 16);
    const armMesh = new THREE.Mesh(armGeo, warmSkinMat);
    armMesh.position.set(0, 0.22, 0);
    wavingArmGroup.add(armMesh);

    const handMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), goldMat);
    handMesh.position.set(0, 0.48, 0);
    wavingArmGroup.add(handMesh);

    model.add(wavingArmGroup);

    halo = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.022, 16, 64), goldMat);
    halo.position.set(0, 1.15, -0.25);
    halo.rotation.x = 0.2;
    model.add(halo);

    model.position.y = -0.35;
    scene.add(model);

    function onWindowResize() {
      if (!threeContainer || !camera || !renderer) return;
      const w = threeContainer.clientWidth || 500;
      const h = threeContainer.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener("resize", onWindowResize);

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (halo) {
        halo.rotation.z = t * 0.45;
      }

      if (model && typeof gsap !== "undefined" && !gsap.isTweening(model.rotation)) {
        model.rotation.y = Math.sin(t * 0.9) * 0.14;
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }

    animate();
  }

  avatarImg.style.cursor = "pointer";
  avatarImg.title = "Cliquer pour saluer l'avatar 3D";

  avatarImg.addEventListener("click", (e) => {
    e.preventDefault();
    avatarModal.classList.add("active");
    body.style.overflow = "hidden";

    if (!threeInitialized) {
      initThree();
      threeInitialized = true;
    }

    requestAnimationFrame(() => {
      if (renderer && camera && threeContainer) {
        const w = threeContainer.clientWidth || 500;
        const h = threeContainer.clientHeight || 320;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      playGreetingAnimation();
    });
  });

  function closeModal() {
    avatarModal.classList.remove("active");
    body.style.overflow = "";
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  avatarModal.addEventListener("click", (e) => {
    if (e.target === avatarModal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && avatarModal.classList.contains("active")) {
      closeModal();
    }
  });
});
