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

    const circle = {
        x: height / 2,
        y: height / 2,
        radius: height / 4,
    }

    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const aspect = icon.height / icon.width;
    const hsx = circle.radius * Math.max(1.0 / aspect, 1.0);
    const hsy = circle.radius * Math.max(aspect, 1.0);

    ctx.drawImage(icon,circle.x - hsx,circle.y - hsy,hsx * 2,hsy * 2);

    const buffer = canvas.toBuffer("image/png");
    return buffer;
}