from pipeline import extract, transform, geocode, load

if __name__ == "__main__":
  extract.run()
  transform.run()
  geocode.run()
  load.run()
