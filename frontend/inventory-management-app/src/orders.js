

document.addEventListener('DOMContentLoaded', function() {
    function togglePanel(panelId) {
        const panels = document.querySelectorAll('.panel-container');
        panels.forEach(panel => {
            if (panel.id === panelId) {
                panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
            } else {
                panel.style.display = 'none';
            }
        });
    }

    // Make togglePanel function globally accessible
    window.togglePanel = togglePanel;
});