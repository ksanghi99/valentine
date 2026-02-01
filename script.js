/* ===== CORRECTED PAGE NAVIGATION ===== */
function showPage(pageId) {
  console.log("Showing page:", pageId); // For debugging
  
  // Hide all pages
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show requested page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  } else {
    console.error("Page not found:", pageId);
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  // Handle page-specific setups
  if (pageId === 'game1Page') {
    startGame1();
  } else if (pageId === 'mazePage') {
    setTimeout(initMazeGame, 100);
  } else if (pageId === 'daysPage') {
    showDay(1);
  } else if (pageId === 'riddlePage') {
    initRiddleGame();
  } else if (pageId === 'matchPage') {
    initMatchingGame();
  } else if (pageId === 'finalPage') {
    createHeartRain();
  }
}

/* ===== INITIALIZE WITH START PAGE ===== */
document.addEventListener('DOMContentLoaded', function() {
  // Make sure only start page is visible initially
  showPage('startPage');
});
