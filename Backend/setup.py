from setuptools import setup, find_packages  # noqa: D100

setup(
    name="pokemon",
    version="0.2",
    packages=find_packages(),
    install_requires=[
        "flask",
        "flask-cors",
        "pytest",
        "pillow",
    ],
)
