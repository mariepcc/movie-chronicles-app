import csv
import re
import time

def extract_title_and_year(movie_title):
    match = re.search(r'^(.*)\s\((\d{4})\)$', movie_title)
    
    if match:
        return match.group(1).strip(), int(match.group(2))
    
    return movie_title.strip(), None

def find_movie_id_by_title_and_year(movies_csv, title, release_date):
    try:
        year = release_date.split('-')[0]
        with open(movies_csv, mode='r', encoding='utf-8') as file:
            reader = csv.reader(file)
            for row in reader:
                movie_title, movie_year = extract_title_and_year(row[1])
                if movie_title.lower() == title.lower() and str(movie_year) == str(year):
                    print(movie_year)
                    return row[0]
                    break
    except FileNotFoundError:
        raise FileNotFoundError(f"{movies_csv} not found. Please provide the correct file path.")
    
def save_movie(movies_csv, title, release_date):
    title = f"{title} ({release_date.split('-')[0]})"
    with open(movies_csv, mode='a+', newline='', encoding='utf-8') as file:
        file.seek(0)  
        rows = sum(1 for line in file)  
        movie_id = rows + 1
        writer = csv.writer(file)
        writer.writerow([movie_id, title])
        print(f"Movie '{title}' saved with ID {movie_id}!")
    return movie_id

def save_rating(ratings_csv, movies_csv, user_id, movie_id, title, release_date, rating):
    if movie_id is None:
        movie_id = save_movie(movies_csv, title, release_date) 

    with open(ratings_csv, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        timestamp = int(time.time())
        writer.writerow([user_id, movie_id, rating, timestamp])
        print("Rating saved!")

