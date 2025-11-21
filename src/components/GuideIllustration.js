import React from 'react';
import Svg, { G, Path, Circle, Rect } from 'react-native-svg';

export const GuideIllustration = ({ width = '100%', height = '100%' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 649.675 619.09" preserveAspectRatio="xMidYMid meet">
      <G transform="translate(-727 -230.692)">
        <Circle cx="45" cy="45" r="45" transform="translate(818.443 266.63)" fill="#ff6584"/>
        <Path d="M408.039,245.192h-5.756V209.751a18.059,18.059,0,0,0-18.059-18.059H359.283v-51h-4v51h-34v53.5h-33.5v513h188V312.936a67.744,67.744,0,0,0-67.744-67.744Z" transform="translate(451.838 90)" fill="#f2f2f2"/>
        <Path d="M580.248,557.692h-4.965v-6.941a18.045,18.045,0,0,0-17-18.006V485.692h-4v47h-18v25h-64v201h142V591.727A34.035,34.035,0,0,0,580.248,557.692Z" transform="translate(451.838 90)" fill="#f2f2f2"/>
        <Path d="M854.283,413.8V401.751a18.044,18.044,0,0,0-17-18.006V336.692h-4v47h-18v30h-85v345h188V481.436a67.742,67.742,0,0,0-64-67.636Z" transform="translate(451.838 90)" fill="#f2f2f2"/>
        {/* Simplified version - showing main elements */}
        <G transform="translate(-459.771 367.371)">
          <Path d="M562.964,225.93l-49.328.386-8.677,165.6h17.615l11.387-75.443,45.683,60.358,16.675-15.093-33.355-45.267Z" transform="translate(1065.451 73.011)" fill="#090814"/>
          <Path d="M561.089,182.53l10.249,23.558-50.109.12,8.691-22.118Z" transform="translate(1057.633 93.866)" fill="#ffb9b9"/>
          <Path d="M554.919,22.988a16.971,16.971,0,1,0-22.058,16.2l3.283,21.683,16.727-13.938a42.115,42.115,0,0,1-5.553-9.79,16.946,16.946,0,0,0,7.6-14.151Z" transform="translate(1057.756 178.681)" fill="#ffb9b9"/>
          <Path d="M555.68,70.93,535.692,83.709,526.466,100a22.806,22.806,0,0,0-2.545,15.558L528.16,137.5h44.2l-6.98-45.755a38.542,38.542,0,0,0-6.5-16.239l-3.2-4.567Z" transform="translate(1056.539 147.492)" fill="#090814"/>
          <Path d="M542.056,83.847l12.524-5.912a10.758,10.758,0,0,1,12.7,9.688l10.406,73.76h-42.5l-5.6-27.149-1.558-22.857Z" transform="translate(1054.366 144.213)" fill="#6c63ff"/>
        </G>
      </G>
    </Svg>
  );
};

