# Step 1: Ask the user for their name using the input() function.
# The text inside the parentheses is what will be displayed to the user.
# Whatever the user types will be captured and stored.
user_name = input("Hello there! What's your name? ")

# Step 2: Now that the name is stored in the 'user_name' variable,
# we can use that variable in our print statement.
# We'll combine (concatenate) strings using the '+' operator.
print("Nice to meet you, " + user_name + "! Welcome to the AI Native Journey.")

# You can also use an f-string for cleaner formatting (available in Python 3.6+):
# print(f"Nice to meet you, {user_name}! Welcome to the AI Native Journey.")