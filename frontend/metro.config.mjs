import path from "path";
import fs from "fs";
import { getDefaultConfig } from "expo/metro-config";

// Get the root of the monorepo
const monorepoRoot = path.resolve(__dirname, "..");
// Get the name of the current workspace
const currentWorkspace = path.basename(__dirname);

// Get the other workspaces
const workspaces = fs.readdirSync(monorepoRoot).filter((f) => {
  const workspacePath = path.join(monorepoRoot, f);
  return fs.statSync(workspacePath).isDirectory() && f !== currentWorkspace;
});

const config = getDefaultConfig(__dirname);

// 1. Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// 3. Force Metro to resolve certain dependencies from the `node_modules` directory of this workspace.
// This is to prevent "Invalid hook call" errors caused by multiple instances of React.
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      return path.join(__dirname, `node_modules/${name}`);
    },
  }
);

export default config;
