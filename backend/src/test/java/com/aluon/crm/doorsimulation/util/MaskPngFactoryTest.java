package com.aluon.crm.doorsimulation.util;

import org.junit.jupiter.api.Test;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;

import static org.junit.jupiter.api.Assertions.*;

class MaskPngFactoryTest {

    @Test
    void createsPngWithWhiteRectOnBlackBackground() throws Exception {
        byte[] png = MaskPngFactory.createRectMaskPng(10, 10, 2, 3, 4, 2);
        assertNotNull(png);
        assertTrue(png.length > 10);

        BufferedImage img = ImageIO.read(new ByteArrayInputStream(png));
        assertNotNull(img);
        assertEquals(10, img.getWidth());
        assertEquals(10, img.getHeight());

        int black = 0x000000;
        int white = 0xFFFFFF;

        assertEquals(black, img.getRGB(0, 0) & 0xFFFFFF);
        assertEquals(white, img.getRGB(2, 3) & 0xFFFFFF);
        assertEquals(white, img.getRGB(5, 4) & 0xFFFFFF);
        assertEquals(black, img.getRGB(9, 9) & 0xFFFFFF);
    }
}

