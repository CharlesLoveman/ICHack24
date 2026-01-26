from setuptools import setup, find_packages  # noqa: D100

setup(
    name="pokemon",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "flask",
        "flask-cors",
        "pytest",
        "pillow",
    ],
)
