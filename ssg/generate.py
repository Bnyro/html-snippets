#!/usr/bin/python

import os
import yaml
import json
import shutil
import markdown

from modules.obj import Page
from modules.generator import PageGenerator

SOURCE_DIR_PATH = "docs"
TARGET_DIR_PATH = "html"
TEMPLATE_FILE_PATH = "template.html"
SOURCE_ASSETS_PATH = "static"
CONFIG_PATH = "config.json"

def get_file_content(file_path) -> dict:
    """
    Get the content of a properly formatted markdown file
    :param file_path: Path of the markdown file
    :return A dict object containing all the extracted information
    """
    with open(file_path) as infile:

        for s in infile:
            if s.startswith('---'):
                break;
        
        yaml_lines = []
        for s in infile:
            if s.startswith('---'):
                break;
            else:
                yaml_lines.append(s)
        
        ym = ''.join(yaml_lines)
        md = ''.join(infile)

    info = yaml.safe_load(ym)
    content = markdown.markdown(md)
    if info is not None:
        info['content'] = content

    return info

def get_nav_html(pages: list) -> str:
    """
    Insert the navigation links inside the file
    :param pages: A list of the [Page] class
    :return The html to be inserted for the navbar
    """
    nav_html = ""
    for page in pages:
        if not page.location.endswith("index.html"):
            location = "/" + page.location.replace(f"{TARGET_DIR_PATH}/", "")
            nav_html += f"<a href={location}><li>{page.title()}</li></a>\n"
        if page.children is not None:
            nav_html += "<ol>\n" + get_nav_html(page.children) + "</ol>\n"

    return nav_html

def get_target_file_path(path: str) -> str:
    """
    Convert the source path to a target path
    """
    path = path.replace(".md", ".html")
    return path.replace(SOURCE_DIR_PATH, TARGET_DIR_PATH)

def index_pages(base_path: str) -> list:
    """
    Indexes all pages for use as navigation list
    :returns A list of the indexed pages
    """
    pages = []
    for f in os.scandir(base_path):
        if f.is_file():
            pages.append(
                Page(
                    get_target_file_path(f.path),
                    get_file_content(f.path)
                )
            )
        elif f.is_dir():
            pages.append(
                Page(
                    get_target_file_path(f.path) + "/",
                    None,
                    index_pages(f.path)
                )
            )
    pages.sort()
    return pages

def generate():
    if (os.path.exists(TARGET_DIR_PATH)):
        shutil.rmtree(TARGET_DIR_PATH)
    os.mkdir(TARGET_DIR_PATH)
    
    with open(TEMPLATE_FILE_PATH) as infile:
        template = infile.read()    

    with open(CONFIG_PATH, "r") as infile:
        config = json.load(infile)   

    pages = index_pages(SOURCE_DIR_PATH)
    nav_html = get_nav_html(pages)

    page_generator = PageGenerator(template, config, nav_html)
    page_generator.create(pages)

    shutil.copytree(
        SOURCE_ASSETS_PATH,
        os.path.join(
            TARGET_DIR_PATH,
            SOURCE_ASSETS_PATH
        )
    )

generate()