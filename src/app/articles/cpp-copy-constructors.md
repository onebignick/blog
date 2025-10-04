---
title: "Copy Constructors in C++"
id: cpp-copy-constructors
date: 2025-06-16
---

In this post I will explain what copy constructors are in C++ and why they are useful.

To illustrate this, we can use a custom Vector (Dynamic array) class as an example:

```cpp
#include <iostream>
#include <cstring>

class Vector {
public:
    
    explicit Vector();
    ~Vector();

    void insert(int);

    int& operator[](size_t index);

    friend std::ostream& operator<<(std::ostream&, const Vector&);
private:
    size_t _size{0};
    int* _buffer{new int[_size]};
};

Vector::Vector() {}

Vector::~Vector() {
    delete[] _buffer;
}

void Vector::insert(int new_value) {
    int* tmp = new int[_size+1];
    memcpy(tmp, _buffer, _size);
    tmp[_size] = new_value;
    _size++;
    delete[] _buffer;
    _buffer = tmp;
}

int& Vector::operator[](size_t index) {
    return _buffer[index];
}

std::ostream& operator<<(std::ostream& stream, const Vector& vector) {
    for(size_t i = 0; i < vector._size; ++i) {
        stream << vector._buffer[i];
        stream << ' ';
    }
    return stream;
}

int main() {
    Vector vector1;
    vector1.insert(1);

    Vector vector2 = vector1;
    std::cout << vector1 << std::endl;
    std::cout << vector2 << std::endl;
    std::cout << std::endl;

    vector2[0] = 2;
    std::cout << vector1 << std::endl;
    std::cout << vector2 << std::endl;
    std::cout << std::endl;
}
```

Lets look at the output:
```
1 
1 

2 
2 

free(): double free detected in tcache 2
zsh: IOT instruction (core dumped)  ./a.out
```
Hmm, the result is not what we expect and the program crashes after, it seems like modifying `vector2` unintentionally modifies `vector1`'s values too. What is going on?

When a user creates a new class in c++, the following are declared implicitly
1. The default constructor
2. The default copy constructor
3. The default copy assignment operator
4. The default move constructor (>c++17)
5. The default move assignment operator (>c++17)

The default copy constructor is **implicitly declared** if no user-defined copy constructor is present. The compiler defines it as a **non-explicit inline public** member of the class having the signature `T::T(const T&)`. Since our custom Vector class did not define a copy constructor, the default copy constructor was used.

It turns out that the default copy constructor in c++ only does a **shallow copy** of the elements. If we were to code it out it would look something like this.
```cpp
Vector::Vector(const& Vector to_copy) {
	_size = to_copy._size;
	_buffer = to_copy._buffer
}
```
This means that `vector1` and `vector2` are pointing to the same address on the heap, when `vector1` goes out of scope, it cleans up the dynamically allocated memory and frees `_buffer`, subsequently, when `vector2` tries to clean up it calls `free()` on already freed memory, resulting in our crash!

To resolve this problem, we should define a **copy constructor** which helps us prevent this error. The copy constructor for our vector class will look like this:
```cpp
Vector::Vector(const Vector& to_copy) {
    _size = to_copy._size;
    _buffer = new int[_size];
    memcpy(_buffer, to_copy._buffer, _size);
}

```
Lets run the application again
```
1 
1 

1 
2 
```
We can see that `vector2` has successfully been modified and is completely distinct from `vector1`, also notice that the double free does not happen anymore. But is that all?

Lets try to reassign `vector1` to `vector2`:
```cpp
int main() {
    Vector vector1;
    vector1.insert(1);

    Vector vector2 = vector1;
    vector2[0] = 2;
    std::cout << vector1 << std::endl;
    std::cout << vector2 << std::endl;
    std::cout << std::endl;

    vector1 = vector2;
    std::cout << vector1 << std::endl;
    std::cout << vector2 << std::endl;
    std::cout << std::endl;
}
```

Here's the output:

```
1 
2 

free(): double free detected in tcache 2
zsh: IOT instruction (core dumped)  ./a.out
```

Oops, looks like the double free is happening again, but why? Well we have only defined the copy constructor, which copies an already initialized object to a new **uninitialized** object. In the case where the object is already initialized, c++ calls the **copy assignment** operator.

The **copy assignment operator** has the signature `T& T::operator=(const T&)` and by default does a shallow copy of the class. It looks like this:

```cpp
Vector& Vector::operator=(const& Vector to_copy) {
	if (this == &to_copy) return *this;
	
	_size = to_copy._size;
	_buffer = to_copy._buffer
	return *this
}
```

Lets add it into our class:

```cpp
Vector& Vector::operator=(const Vector& to_copy) {
    if (this == &to_copy) return *this;

    delete[] _buffer;
    _size = to_copy._size;
    _buffer = new int[_size];

    memcpy(_buffer, to_copy._buffer, _size);
    return *this;
}
```

And run the example again

```
1 
2 

2 
2 
```

No more double free!

# Going further
As a rule of thumb, if you are manually managing your memory by calling `new` or `delete` you will need a copy constructor and a copy assignment operator. If not the default copy constructor and assignment operator will suffice.

In this case we can mark it as default, for example a custom date class:

```cpp
class Date {
public:
    Date();
    ~Date();
    Date(const Date&) = default;
    Date& operator=(const Date&) = default;

private:
    int day, month, year;
};
```

Alternatively, if you want to make sure your class cannot be copied, you can delete both the operators to disable that functionality

```cpp
class Date {
public:
    Date();
    ~Date();
    Date(const Date&) = delete;
    Date& operator=(const Date&) = delete;

private:
    int day, month, year;
};
```

Now the compiler will throw an error whenever you try to copy an object.