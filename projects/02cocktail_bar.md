---
title: Cocktail Bar
layout: default
parent: Projects
nav_order: 2
---

<link rel="stylesheet" href="../css/images.css">

A simple Android app to store cocktail recipes.

My friends and I will occasionally have a cocktail night, where we invent new recipes. The apps on the play store were either too generic (like a note-taking app) or too complex (requiring manual linking between ingredients and recipes).

In this app, the recipes are entered as text, and auto-links to ingredients so that they can be filtered by what ingredients you in stock. Here's the [source code].

<div class="gallery" onclick="openLightbox(event)" >
    <!-- <div style="overflow: auto; white-space: nowrap;"> -->
    <img src="../assets/images/cocktail_bar00.png"/>
    <img src="../assets/images/cocktail_bar01.png"/>
    <img src="../assets/images/cocktail_bar02.png"/>
    <img src="../assets/images/cocktail_bar03.png"/>
    <div id="lightbox">
        <span id="close-btn" onclick="closeLightbox()">&times;</span>
        <img id="lightbox-img" src="">
        <button id="prev-btn" onclick="changeImage(-1)">&lt;</button>
        <button id="next-btn" onclick="changeImage(1)">&gt;</button>
    </div>
</div>

<script>
    let currentIndex = 0;
    const images = document.querySelectorAll('.gallery img');
    const totalImages = images.length;

    function openLightbox(event) {
        if (event.target.tagName !== 'IMG') {
            return;
        }
        const clickedIndex = Array.from(images).indexOf(event.target);
        currentIndex = clickedIndex;
        updateLightboxImage();
        document.getElementById('lightbox').style.display = 'flex';
    }

    function closeLightbox() {
        document.getElementById('lightbox').style.display = 'none';
    }

     function changeImage(direction) {
        currentIndex += direction;
        if (currentIndex >= totalImages) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = totalImages - 1;
        }
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const lightboxImg = document.getElementById('lightbox-img');
        lightboxImg.src = images[currentIndex].src;
    }

    // // Add initial thumbnails
    // updateLightboxImage();


    // // To add keyboard navigation (left/right arrow keys)
    // document.addEventListener('keydown', function (e) {
    //     if (document.getElementById('lightbox').style.display === 'flex') {
    //         if (e.key === 'ArrowLeft') {
    //             changeImage(-1);
    //         } else if (e.key === 'ArrowRight') {
    //             changeImage(1);
    //         }
    //     }
    // });
</script>

[source code]: https://github.com/Nick-Sullivan/cocktail-bar
