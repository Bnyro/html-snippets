def replace_by_key(text: str, dict: dict) -> str:
    """
    Replace the keys of a dict with their values inside a text
    :param text: The base text to modify
    :param dict: The dict object containing the fields to replace
    :return The modified text as string
    """
    for key in dict:
        text = text.replace("{{" + key + "}}", str(dict[key]))
    return text