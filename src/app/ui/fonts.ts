/*
 * This is a font configuration file where we define Roboto (by Google) to be the preferred font
 * Yes, I like it very much, I am an Android hardcore user
 * It is based on the next/font library
 */
import { Roboto } from 'next/font/google';
 
export const roboto = Roboto({ weight: "300", subsets: ['latin'] });