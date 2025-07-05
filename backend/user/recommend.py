import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy

# Load the MovieLens dataset
RATINGS_CSV = "backend/user/ratings.csv"
MOVIES_CSV = "backend/user/movies.csv"


column_names = ["userId", "movieId", "rating", "timestamp"]
df = pd.read_csv(RATINGS_CSV, sep=",", names=column_names)

# Load movie titles
movie_columns = [
    "movieId",
    "title",
    "genres",
]
df_movies = pd.read_csv(MOVIES_CSV, sep=",", names=movie_columns, encoding="latin-1")

# Create a mapping of item_id to movie title
movie_titles = dict(zip(df_movies["movieId"], df_movies["title"]))

# Convert the dataframe to Surprise format
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(df[["userId", "movieId", "rating"]], reader)

# Split the data into training and test sets
trainset, testset = train_test_split(data, test_size=0.2)

# Use SVD (Singular Value Decomposition) algorithm
model = SVD()

# Train the model on the training set
model.fit(trainset)

# Predict ratings for the test set
predictions = model.test(testset)

# Compute and print the accuracy
accuracy.rmse(predictions)


# Function to recommend top N items for a given user
def recommend(user_id, num_recommendations=5):
    # Get a list of all item_ids
    all_items = df["movieId"].unique()

    # Predict ratings for all items
    predicted_ratings = [model.predict(user_id, item_id).est for item_id in all_items]

    # Create a list of item_id and their predicted ratings
    item_ratings = list(zip(all_items, predicted_ratings))

    # Sort the items by predicted ratings in descending order
    item_ratings.sort(key=lambda x: x[1], reverse=True)

    # Get the top N items
    top_items = item_ratings[:num_recommendations]

    # Convert item_ids to movie titles
    top_items_with_titles = [
        (movie_titles[item_id], rating) for item_id, rating in top_items
    ]

    # Return the top N recommended items with titles
    return top_items_with_titles
