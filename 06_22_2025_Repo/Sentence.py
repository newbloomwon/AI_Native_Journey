def get_user_words():
  """
  Asks the user to input a noun, a verb, and an adjective,
  and returns these three words as a tuple.

  Returns:
      tuple: A tuple containing (noun, verb, adjective) as strings.
  """
  # Prompt the user for a noun and store it
  noun = input("Please enter a noun: ")

  # Prompt the user for a verb and store it
  verb = input("Please enter a verb: ")

  # Prompt the user for an adjective and store it
  adjective = input("Please enter an adjective: ")

  # Return the collected words
  return (noun, verb, adjective)

# Example of how to call the function and use its return values:
if __name__ == "__main__":
    # The lines below were commented out, preventing the function from running.
    # They have been uncommented to allow the script to execute the function.
    my_noun, my_verb, my_adjective = get_user_words()
    print(f"You entered: Noun='{my_noun}', Verb='{my_verb}', Adjective='{my_adjective}'")
