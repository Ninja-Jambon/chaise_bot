import { createCanvas, loadImage } from 'canvas';
import * as  fs from "node:fs";

export async function createWelcomeImage(background_url: string, icon_url: string, user_id: string) {
    const background = await loadImage(background_url)
    const icon = await loadImage(icon_url)

    var width;
    var height;

    if (background.width > 500) {
        width = 500;
        height = 500 * background.height / background.width;
    } else {
        width = background.width;
        height = background.height;
    }

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(background, 0, 0, width, height);
    ctx.drawImage(icon, height / 4, height / 4, height / 4 * 2, height / 4 * 2);

    const buffer = canvas.toBuffer("image/png");
    return buffer;
}