import {
  FilesGraph,
  Graph,
  MapExtensionsGraph,
  MapInnerKeysGraph,
  MapValuesGraph,
  ObjectGraph,
  parseYaml,
} from "@graphorigami/origami";
import indexPage from "./indexPage.js";
import personPage from "./personPage.js";
import thumbnail from "./thumbnail.js";

const files = new FilesGraph(import.meta.url);
const assets = await files.get("assets");
const images = await files.get("images");
const teamGraph = await parseYaml(await files.get("teamData.yaml"));

const siteName = "Our Amazing Team";
const teamByName = new MapInnerKeysGraph(teamGraph, (value) =>
  value.get("name")
);

const indexHtml = indexPage(await Graph.plain(teamByName), siteName);
const thumbnails = new MapValuesGraph(images, thumbnail);
const team = new MapExtensionsGraph(
  teamByName,
  async (person) => personPage(await Graph.plain(person), siteName),
  {
    extension: "->html",
  }
);

export default new ObjectGraph({
  assets,
  images,
  "index.html": indexHtml,
  team,
  thumbnails,
});
