async function loadSidebar() {
  try {
    const res = await fetch('../sidebar/sidebar.html');
    if (!res.ok) throw new Error('Failed to load sidebar.html');
    const html = await res.text();
    document.getElementById('sidebar-placeholder').innerHTML = html;

    // Attach toggle event after sidebar is loaded
    const sidebar = document.getElementById('sidebar-container');
    const mainContent = document.getElementById('main-content');
    const toggleBtn = document.getElementById('sidebarToggle');

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('sidebar-hidden');
    });
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
});
