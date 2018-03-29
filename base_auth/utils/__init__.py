from collections import namedtuple

UUID_REGEX = r'[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'


class Range(namedtuple('Range', ['min', 'max'])):

    def __contains__(self, value):
        if self.min is None:
            return value <= self.max

        if self.max is None:
            return self.min <= value

        return self.min <= value <= self.max

    def __str__(self):
        left = '...' if self.min is None else self.min
        right = '...' if self.max is None else self.max

        return '[{} - {}]'.format(left, right)

    def __repr__(self):
        return 'Range({}, {})'.format(self.min, self.max)
