sudo docker run --rm -it --network host --hostname api --name api -v $(pwd):/home --workdir /home mcr.microsoft.com/dotnet/sdk:7.0 dotnet run