package com.aluon.crm.doorsimulation.util;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

import javax.imageio.ImageIO;

public final class MaskPngFactory {

    private MaskPngFactory() {
    }

    public static byte[] createRectMaskPng(int imageWidth, int imageHeight, int x, int y, int width, int height) {
        if (imageWidth <= 0 || imageHeight <= 0) throw new IllegalArgumentException("Dimensiones de imagen inválidas");
        if (width <= 0 || height <= 0) throw new IllegalArgumentException("Dimensiones de máscara inválidas");
        if (x < 0 || y < 0) throw new IllegalArgumentException("Coordenadas de máscara inválidas");
        if (x + width > imageWidth || y + height > imageHeight) throw new IllegalArgumentException("La máscara sale fuera de la imagen");

        BufferedImage img = new BufferedImage(imageWidth, imageHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        try {
            g.setColor(Color.BLACK);
            g.fillRect(0, 0, imageWidth, imageHeight);
            g.setColor(Color.WHITE);
            g.fillRect(x, y, width, height);
        } finally {
            g.dispose();
        }

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos);
            return baos.toByteArray();
        } catch (Exception ex) {
            throw new IllegalArgumentException("No se pudo generar la máscara PNG");
        }
    }
}

