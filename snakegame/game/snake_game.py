#backend/game/snake_game.py

import random

# Constants for the game
BOARD_SIZE = (20, 20)  # Board size: width x height

class SnakeGame:
    def __init__(self):
        self.board_size = BOARD_SIZE
        self.snake = [(5, 5)]  # Initial snake position
        self.food = self.place_food()
        self.direction = 'right'
        self.game_over = False

    def place_food(self):
        # Place food at a random position not occupied by the snake
        while True:
            food_position = (random.randint(0, self.board_size[0] - 1), random.randint(0, self.board_size[1] - 1))
            if food_position not in self.snake:
                return food_position

    def update_snake(self):
        if self.game_over:
            return
        
        # Move the snake in the current direction
        head_x, head_y = self.snake[0]
        if self.direction == 'up':
            new_head = (head_x, head_y - 1)
        elif self.direction == 'down':
            new_head = (head_x, head_y + 1)
        elif self.direction == 'left':
            new_head = (head_x - 1, head_y)
        elif self.direction == 'right':
            new_head = (head_x + 1, head_y)
        
        # Check for collisions
        if (new_head[0] < 0 or new_head[0] >= self.board_size[0] or
            new_head[1] < 0 or new_head[1] >= self.board_size[1] or
            new_head in self.snake):
            self.game_over = True
            return
        
        # Add new head to snake
        self.snake = [new_head] + self.snake[:-1]
        
        # Check if food is eaten
        if new_head == self.food:
            self.snake.append(self.snake[-1])  # Grow the snake
            self.food = self.place_food()  # Place new food

    def change_direction(self, new_direction):
        # Prevent reversing direction
        if (self.direction == 'up' and new_direction != 'down') or \
           (self.direction == 'down' and new_direction != 'up') or \
           (self.direction == 'left' and new_direction != 'right') or \
           (self.direction == 'right' and new_direction != 'left'):
            self.direction = new_direction

    def get_game_state(self):
        return {
            'snake': self.snake,
            'food': self.food,
            'game_over': self.game_over
        }

def run_game():
    game = SnakeGame()
    while not game.game_over:
        game.update_snake()
        # You can add more code here for real-time game updates and rendering
        print(game.get_game_state())  # Example: Print game state to console

def restart_game():
    return SnakeGame()  # Restart by returning a new instance of SnakeGame
