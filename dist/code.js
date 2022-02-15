var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, { width: 232, height: 183 });
const hexToRgb = (color) => {
    return {
        r: parseInt(color.substr(1, 2), 16) / 255,
        g: parseInt(color.substr(3, 2), 16) / 255,
        b: parseInt(color.substr(5, 2), 16) / 255
    };
};
const createShapes = (msg) => __awaiter(this, void 0, void 0, function* () {
    if (!msg.paletteId) {
        return;
    }
    let paletteId = msg.paletteId;
    if (/https:\/\/colorhunt.co\/palette\//.test(paletteId)) {
        const paletteIdMatch = paletteId.match(/https:\/\/colorhunt.co\/palette\/(.*)/);
        if (paletteIdMatch) {
            paletteId = paletteIdMatch[1];
        }
        else {
            return;
        }
    }
    const paletteUrl = `https://colorhunt.co/palette/${paletteId}`;
    const colorHuntWebpage = yield fetch(`https://api.allorigins.win/get?url=${paletteUrl}`).then(r => r.text());
    const colorRegex = /#(?:[0-9a-fA-F]{3}){1,2}/gm;
    const htmlTitle = /<title>(.*?)<\/title>/gm;
    const colors = colorHuntWebpage.match(htmlTitle)[0].match(colorRegex);
    if (!colors) {
        return;
    }
    const colorsFrame = figma.createFrame();
    colorsFrame.name = 'Colors';
    colorsFrame.x = figma.viewport.center.x - (colorsFrame.width / 2);
    colorsFrame.y = figma.viewport.center.y - (colorsFrame.height / 2);
    colorsFrame.resize(colors.length * 100, 100);
    colorsFrame.fills = [];
    colors.forEach((color, index) => {
        const colorRgb = hexToRgb(color);
        let colorStyle;
        let colorFill;
        if (msg.colorStyles) {
            colorStyle = figma.createPaintStyle();
            colorStyle.name = color;
            colorStyle.paints = [{ type: 'SOLID', color: colorRgb }];
        }
        else {
            colorFill = { type: 'SOLID', color: colorRgb };
        }
        const shape = figma.createRectangle();
        shape.resize(100, 100);
        if (colorStyle) {
            shape.fillStyleId = colorStyle.id;
        }
        else {
            shape.fills = [colorFill];
        }
        shape.name = color;
        shape.x = index * 100;
        shape.y = 0;
        colorsFrame.appendChild(shape);
    });
    figma.currentPage.appendChild(colorsFrame);
});
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    switch (msg.type) {
        case 'create-colors':
            yield createShapes(msg);
            break;
    }
    figma.closePlugin();
});
