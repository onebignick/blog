---
id: raii
aliases: []
tags: []
datePosted: "2025-06-21"
dateUpdated: "2025-06-21"
---

# Resource Acquisition is Initialization!

Resource Acquisition is Initialization (RAII) is a pattern in c++ to ensure that resources are properly cleaned up when they go out of scope. Before we do a deep dive on the RAII pattern, we first need to learn about resources and ownership
## What is a resource
A resource in C++ is some facility or concept that you gain access to by a statement or expression, and you **can** release or dispose of that facility or concept by some other statement or expression. You can think of it like a mutex, I gain access to the mutex by locking it, that mutex is said to be a resource that i own.

```cpp
void example(pthread_mutex_t& mtx) {
	pthread_mutex_lock(&mtx); // i "acquire" the mutex resource here
	pthread_mutex_unlock(&mtx); // i "dispose" of the mutex here
}
```

## What is ownership
Simply put, ownership is when you assume the responsibility of initializing and disposing of resources. For example, when you lock a mutex, you must remember to unlock it.
## Common problems
Some common problems that the RAII pattern solves are:
### Leak
```cpp
void example() {
	T obj = new T{}; // i "acquire" some memory
	// i forget to release the resource
}
```
A leak happens when a resource is acquired but never released.

### Use After Free
```cpp
void example() {
	T obj = new T{};
	delete obj;
	T abc = obj;
}
```
Undefined behavior happens when an object that is allocated on the heap is deleted and then accessed after.

### Double Free
```cpp
void example() {
	T obj = new T{};
	delete obj;
	delete obj;
}
```
Undefined behavior also happens when you attempt to free the object twice
## What is RAII
RAII is a class where resource acquisition is done in the constructor and resource disposal is done in the destructor. An RAII class is said to own the resource. it is responsible for cleaning up that resource at appropriate time

Below are some common resources that must be Acquired and Disposed

1. Memory
2. Files
3. Joinable Threads
4. Mutex

## Creating your own RAII class
Lets start by creating our own `unique_pointer` class. This function will have **exclusive ownership** over a pointer and will be responsible for acquiring resources and disposing of them after.

```cpp
template<typename T>
class unique_pointer {
    private:
        T* pointer_ = nullptr;

    public:
        explicit unique_pointer(T* pointer = nullptr) noexcept;
        unique_pointer(const unique_pointer&) = delete;
        unique_pointer& operator=(const unique_pointer&) = delete;
        unique_pointer(unique_pointer&&) noexcept;
        unique_pointer& operator=(unique_pointer&&) noexcept;
        ~unique_pointer() noexcept;


        [[nodiscard]] T& operator*() const noexcept; 
        [[nodiscard]] T* operator->() const noexcept;
        explicit operator bool() const noexcept;
        void reset(T*) noexcept;
        [[nodiscard]] T* release() noexcept;
};
```
Lets start off by defining the constructor and destructor of an object.
```cpp
template<typename T>
unique_pointer<T>::unique_pointer(T* pointer) noexcept : pointer_{pointer} {}

template<typename T>
unique_pointer<T>::~unique_pointer() noexcept {
    delete pointer_;
}
```
Our class will assume ownership over the object that is passed into the constructor and will be responsible for deleting it. Since we have declared a destructor the **rule of 5** applies. The **rule of 5** states that if we have to declare any one of destructor/copy/move, we likely have to have all.

The full code is put below
```cpp
#include <iostream>

template<typename T>
class unique_pointer {
    private:
        T* pointer_ = nullptr;

    public:
        explicit unique_pointer(T* pointer = nullptr) noexcept;
        unique_pointer(const unique_pointer&) = delete;
        unique_pointer& operator=(const unique_pointer&) = delete;
        unique_pointer(unique_pointer&&) noexcept;
        unique_pointer& operator=(unique_pointer&&) noexcept;
        ~unique_pointer() noexcept;


        [[nodiscard]] T& operator*() const noexcept; 
        [[nodiscard]] T* operator->() const noexcept;
        explicit operator bool() const noexcept;
        void reset(T*) noexcept;
        [[nodiscard]] T* release() noexcept;
};

template<typename T>
unique_pointer<T>::unique_pointer(T* pointer) noexcept : pointer_{pointer} {}

template<typename T>
unique_pointer<T>::unique_pointer(unique_pointer&& moved_object) noexcept {
    pointer_ = moved_object.pointer_;
    moved_object.pointer_ = nullptr;
}

template<typename T>
unique_pointer<T>& unique_pointer<T>::operator=(unique_pointer&& moved_object) noexcept {
    if (this == &moved_object) return *this;

    delete pointer_;
    pointer_ = moved_object.pointer_;
    moved_object.pointer_ = nullptr;
    return *this;
}

template<typename T>
unique_pointer<T>::~unique_pointer() noexcept {
    delete pointer_;
}

template<typename T>
[[nodiscard]] T& unique_pointer<T>::operator*() const noexcept {
    return *pointer_;
}

template<typename T>
[[nodiscard]] T* unique_pointer<T>::operator->() const noexcept {
    return pointer_;
}

template<typename T>
unique_pointer<T>::operator bool() const noexcept {
    return static_cast<bool>(pointer_);
}

template<typename T>
void unique_pointer<T>::reset(T* pointer) noexcept {
    delete pointer_;
    pointer_ = pointer;
}

template<typename T>
[[nodiscard]] T* unique_pointer<T>::release() noexcept {
    T* released_pointer = pointer_;
    pointer_ = nullptr;
    return released_pointer;
}

class Box {
    public:
    Box() { std::cout << "constructor called" << std::endl; }
    ~Box() { std::cout << "destructor called" << std::endl; }

    void get() {
        std::cout << "hello world" << std::endl;
    }
};

int main() {
    int n = 1;
    for(int i = 0; i < n; i++) {
        unique_pointer<Box> box_pointer(new Box());
        box_pointer->get();
    }

    unique_pointer<Box> pBox(new Box());
    unique_pointer<Box> test_move = std::move(pBox);

    unique_pointer<Box> test_move_assignment;
    test_move_assignment = std::move(test_move);
    
    std::cout << (bool)test_move << std::endl;
    std::cout << (bool)test_move_assignment << std::endl;
}
```
Notice that the destructor of the box pointer automatically get called when it goes out of scope. This is how the RAII pattern helps us prevent leaks, use after free and double free.
