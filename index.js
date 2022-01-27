window.addEventListener("load", event => {

    namecolorlabel.style.backgroundColor = namecolor.value;
    txtcolorlabel.style.backgroundColor = txtcolor.value;
    messagecolorlabel.style.backgroundColor = messagecolor.value;

    namecolor.addEventListener("change", () => {
        namecolorlabel.style.backgroundColor = namecolor.value;
    });

    txtcolor.addEventListener("change", () => {
        txtcolorlabel.style.backgroundColor = txtcolor.value;
    });

    messagecolor.addEventListener("change", () => {
        messagecolorlabel.style.backgroundColor = messagecolor.value;
    });

    namecolorlabel.addEventListener("mouseenter", () => {
        namecolorlabel.style.backgroundColor = lightenColor(namecolor.value, 50);
    });

    txtcolorlabel.addEventListener("mouseenter", () => {
        txtcolorlabel.style.backgroundColor = lightenColor(txtcolor.value, 50);
    });

    messagecolorlabel.addEventListener("mouseenter", () => {
        messagecolorlabel.style.backgroundColor = lightenColor(messagecolor.value, 50);
    });

    namecolorlabel.addEventListener("mouseleave", () => {
        namecolorlabel.style.backgroundColor = namecolor.value;
    });

    txtcolorlabel.addEventListener("mouseleave", () => {
        txtcolorlabel.style.backgroundColor = txtcolor.value;
    });

    messagecolorlabel.addEventListener("mouseleave", () => {
        messagecolorlabel.style.backgroundColor = messagecolor.value;
    });

});
function validateHex(color) {
    if (color[0] == "#") {
        color = color.slice(1);
    }
    if (color.length === 3) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    if (color.length !== 6 || color.match(/[g-z]/)) {
        throw new Error("Invalid hex");
    }

    return color;
}

function getRGB(color) {
    let r = Number(`0x${color[0] + color[1]}`),
        g = Number(`0x${color[2] + color[3]}`),
        b = Number(`0x${color[4] + color[5]}`);

    return { r: r, g: g, b: b };
}

function getHex(rgb) {
    if((rgb.r < 0 || rgb.g < 0 || rgb.b < 0) || (rgb.r > 255 || rgb.g > 255 || rgb.b > 255))
        throw new Error("RGB Numbers out of bound.");

    let hexr = (rgb.r.toString(16).length === 1 ? "0" : "") + rgb.r.toString(16),
        hexg = (rgb.g.toString(16).length === 1 ? "0" : "") + rgb.g.toString(16),
        hexb = (rgb.b.toString(16).length === 1 ? "0" : "") + rgb.b.toString(16);

    return validateHex(hexr + hexg + hexb);
}

function invertColor(color) {
    color = validateHex(color);
    let rgb = getRGB(color);

    let newr = 255 - rgb.r,
        newg = 255 - rgb.g,
        newb = 255 - rgb.b; 

    return getHex({r: newr, g: newg, b: newb});
}

function darkenColor(color, percent)
{
    if (percent > 1) percent = percent / 100;

    color = validateHex(color);
    let rgb = getRGB(color);

    let r = Math.max(Math.floor(rgb.r - (255 * percent)), 0),
        g = Math.max(Math.floor(rgb.g - (255 * percent)), 0),
        b = Math.max(Math.floor(rgb.b - (255 * percent)), 0);
    color = getHex({r: r.toString(16), g:g.toString(16), b: b.toString(16)});

    return color;
}

function lightenColor(color, percent)
{
    if (percent > 1) percent = percent / 100;

    color = validateHex(color);
    let rgb = getRGB(color);

    let r = Math.min(Math.floor(rgb.r + (255 * percent)), 255),
        g = Math.min(Math.floor(rgb.g + (255 * percent)), 255),
        b = Math.min(Math.floor(rgb.b + (255 * percent)), 255);
        
    color = getHex({r: r.toString(16), g:g.toString(16), b: b.toString(16)});

    return color;
}