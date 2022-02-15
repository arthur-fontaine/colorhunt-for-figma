//vars
const createColorsButton = document.querySelector('#create-colors');
const cancelButton = document.querySelector('#cancel');
const colorStylesToggle = document.querySelector('#color-styles');
const paletteIdInput = document.querySelector('#palette-id');

//on load function
document.addEventListener("DOMContentLoaded", function() {
    formValidation();
});

//initialize select menu
selectMenu.init();

//initialize disclosures
disclosure.init();

//event listeners
paletteIdInput.oninput = () => { formValidation(); }
colorStylesToggle.onchange = () => { formValidation(); }
createColorsButton.onclick = () => { createColors(); }
cancelButton.onclick = () => { cancel(); }

//form validation
const formValidation = function(event) {
    if (paletteIdInput.value === '') {
        createColorsButton.disabled = true;
    } else {
        createColorsButton.disabled = false;
    }
}



//functions
function createColors() {
    parent.postMessage({ pluginMessage: {
        type: 'create-colors',
        paletteId: paletteIdInput.value,
        colorStyles: colorStylesToggle.checked
    } }, '*');
}

function cancel() {
    parent.postMessage({ pluginMessage: { 'type': 'cancel' } }, '*')
    disclosure.destroy();
    selectMenu.destroy();
}
