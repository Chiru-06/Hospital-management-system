import sys
import os

project_home = '/home/chiragchiru/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)
os.chdir(project_home)

from app import create_app
application = create_app()