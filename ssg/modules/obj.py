from dataclasses import dataclass

@dataclass
class Page:
    location: str
    content: dict | None = None
    children: list | None = None

    def __lt__(self, other):
        return self.title() < other.title()

    def title(self) -> str:
        """
        Get the title of a Page object
        :param page: The page to get the title from
        :return The title of the page
        """
        if self.content is not None:
            return self.content["title"]

        if self.children is not None:
            for child in self.children:
                if child.location.endswith("index.html"):
                    return child.content["title"]

        return self.location.split("/")[-1].replace(".html", "").replace("-", "").replace("_", "").capitalize()