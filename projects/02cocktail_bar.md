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

<div style="overflow: auto; white-space: nowrap;">
<img src="../assets/images/cocktail_bar00.png" class="screenshot" onclick="openFullscreen(this)"/>
<img src="../assets/images/cocktail_bar01.png" class="screenshot"/>
<img src="../assets/images/cocktail_bar02.png" class="screenshot"/>
<img src="../assets/images/cocktail_bar03.png" class="screenshot"/>
</div>

<script>
    function openFullscreen(img) {
        img.requestFullscreen();
    }
</script>

[source code]: https://github.com/Nick-Sullivan/cocktail-bar
