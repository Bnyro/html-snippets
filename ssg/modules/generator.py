from modules.obj import Page
from modules.util import replace_by_key

import os

class PageGenerator:
    def __init__(self, template, config, nav_html):
        self.template = template
        self.config = config
        self.nav_html = nav_html

    def render_html(self, content) -> str:
        """
        Replace all the keys in the dict object with their values inside the template
        :param content: Dict object containing the source configuration
        :return The rendered HTML as string
        """
        html = replace_by_key(self.template, content)
        html = replace_by_key(html, self.config)
        html = html.replace("{{navlinks}}", self.nav_html)

        return html

    def create_output_file(self, page: Page):
        """
        Generate an output file by reading the markdown file and rendering it into the template
        :param page: The page object to use
        """
        html = self.render_html(page.content)

        with open(page.location, 'w') as outfile:
            outfile.write(html)

    def create(self, pages):
        for page in pages:
            if page.content is not None:
                self.create_output_file(page)
            else:
                if not os.path.exists(page.location):
                    os.mkdir(page.location)
                self.create(page.children)