#!/usr/bin/python
from __future__ import print_function
import sys

def main():
    """Convert Project Euler puzzles to single-line strings"""
    f = open(sys.argv[1], 'r')
    lines = f.readlines()
    f.close()
    rows = [line.rstrip('\n') for line in lines if "Grid" not in line]
    newLines = []
    for i in range(50):
        newLines.append(reduce(lambda x, y: x + y, rows[i*9:(i+1)*9]))
    f = open(sys.argv[2], 'w')
    for line in newLines:
        print(line, file=f)
    f.close()

if __name__ == "__main__":
    main()
