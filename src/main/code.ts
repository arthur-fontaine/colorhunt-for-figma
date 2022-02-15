figma.showUI(__html__, {width: 232, height: 183 });

const hexToRgb = (color: string) => {
	return {
		r: parseInt(color.substr(1, 2), 16) / 255,
		g: parseInt(color.substr(3, 2), 16) / 255,
		b: parseInt(color.substr(5, 2), 16) / 255
	};
}

const createShapes = async (msg: any) => {
	if (!msg.paletteId) {
		return;
	}

	let paletteId = msg.paletteId;

	if (/https:\/\/colorhunt.co\/palette\//.test(paletteId)) {
		const paletteIdMatch = paletteId.match(/https:\/\/colorhunt.co\/palette\/(.*)/);
		if (paletteIdMatch) {
			paletteId = paletteIdMatch[1];
		} else {
			return;
		}
	}

	const paletteUrl = `https://colorhunt.co/palette/${paletteId}`;

	const colorHuntWebpage = await fetch(`https://api.allorigins.win/get?url=${paletteUrl}`).then(r => r.text());

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

		let colorStyle: PaintStyle;
		let colorFill: Paint;

		if (msg.colorStyles) {
			colorStyle = figma.createPaintStyle()
			colorStyle.name = color;
			colorStyle.paints = [{type: 'SOLID', color: colorRgb}];
		} else {
			colorFill = {type: 'SOLID', color: colorRgb};
		}

		const shape = figma.createRectangle();

		shape.resize(100, 100);
		if (colorStyle) {
			shape.fillStyleId = colorStyle.id;
		} else {
			shape.fills = [colorFill];
		}
		shape.name = color;
		shape.x = index * 100;
		shape.y = 0;
		colorsFrame.appendChild(shape);
	});

	figma.currentPage.appendChild(colorsFrame);
}

figma.ui.onmessage = async msg => {
	switch (msg.type) {
		case 'create-colors':
			await createShapes(msg);
			break;
	}

	figma.closePlugin();
};
