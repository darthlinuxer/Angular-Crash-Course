# Angular  
**docker pull camilochaves/angular:13.3.5**
steps:
* docker run --rm -it --network host --name angular --hostname angular -v $(pwd):/home camilochaves/angular:13.3.5 bash  
* now inside the container navigate to the home directory: cd /home and type
  * npm install  
  * ng serve --live-reload  
  
# .NET
On the project folder: dotnet run
