// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Optimize asset resolution
config.resolver.assetExts.push(
  // Add any additional asset extensions if needed
);

// Enable minification in production
config.transformer.minifierConfig = {
  ecma: 8,
  keep_classnames: false,
  keep_fnames: false,
  mangle: {
    module: true,
    keep_classnames: false,
    keep_fnames: false,
  },
  module: true,
  output: {
    ascii_only: true,
    quote_style: 3,
    wrap_iife: true,
  },
  sourceMap: {
    includeSources: false,
  },
  toplevel: false,
  compress: {
    // Aggressive compression
    arguments: true,
    dead_code: true,
    drop_console: false, // Keep console for debugging, set to true in production if needed
    drop_debugger: true,
    ecma: 8,
    evaluate: true,
    inline: 1,
    keep_classnames: false,
    keep_fnames: false,
    passes: 3,
    unsafe: false,
    unsafe_comps: false,
    unsafe_math: false,
    unsafe_methods: false,
  },
};

module.exports = config;

