# game/ai.py

import random

class SnakeAI:
    def __init__(self, board_size, snake_position, food_position):
        self.board_size = board_size
        self.snake_position = snake_position
        self.food_position = food_position

    def get_next_move(self):
        snake_x, snake_y = self.snake_position
        food_x, food_y = self.food_position
        possible_moves = self.get_possible_moves()

        # Calculate the distance to the food in each direction
        distances = {
            'up': self.calculate_distance(snake_x, snake_y - 1, food_x, food_y),
            'down': self.calculate_distance(snake_x, snake_y + 1, food_x, food_y),
            'left': self.calculate_distance(snake_x - 1, snake_y, food_x, food_y),
            'right': self.calculate_distance(snake_x + 1, snake_y, food_x, food_y),
        }

        # Choose the move that minimizes the distance to the food
        best_move = min(possible_moves, key=lambda move: distances.get(move, float('inf')))

        return best_move

    def get_possible_moves(self):
        # Return all possible moves; implement logic to avoid moving back into itself or off the board
        return ['up', 'down', 'left', 'right']

    def calculate_distance(self, x1, y1, x2, y2):
        # Use Manhattan distance to measure the distance between two points
        return abs(x1 - x2) + abs(y1 - y2)
