---
id: rendezvous
aliases: []
tags: []
datePosted: "2025-06-23"
dateUpdated: "2025-06-23"
---

# Est-ce que vous voulez rendezvous ce soir?

Recently I started reading the little book of semaphores, a book designed to teach computer science students about concurrency. I'm now writing this to share what I've learnt.
### The problem
Imagine that we have 2 workers that are each doing a task. Each task comprises of 2 jobs. The second job requires both worker A and B's first job to be completed. How do we ensure that the two workers always start the second job after both workers complete their first job?
```cpp
#include <iostream>
#include <thread>

void task_a() {
    std::cout << "job a1 completed" << std::endl;
    std::cout << "job a2 completed" << std::endl;
}

void task_b() {
    std::cout << "job b1 completed" << std::endl;
    std::cout << "job b2 completed" << std::endl;
}

int main() {
    std::jthread worker_a(task_a), worker_b(task_b);
}
```
Sometimes this code will work, lets look at one such example.
```
job a1 completed
job b1 completed
job b2 completed
job a2 completed
```
in this case a2 and b2 are always completed after a1 and b1, which is correct. However if you run this piece of code more times, you may see this permutation.
```
job b1 completed
job b2 completed
job a1 completed
job a2 completed
```
This is an invalid case because b2 executes before a1 is completed.
### The solution
In the book Downey discusses the **rendezvous pattern** (fun fact, rendezvous means to meet up in french, _render_ (to meet) and _vous_ (you)), a synchronization pattern meant to ensure that 2 threads meet up at the same section before processing further. This can be done using two semphores, below is my implementation in c++;
```cpp
#include <semaphore>
#include <iostream>
#include <thread>

std::counting_semaphore a_is_completed{0}, b_is_completed{0};

void worker1() {
    std::cout << "job a1 completed" << std::endl;
    a_is_completed.release();
    b_is_completed.acquire();
    std::cout << "job a2 completed" << std::endl;
}

void worker2() {
    std::cout << "job b1 completed" << std::endl;
    b_is_completed.release();
    a_is_completed.acquire();
    std::cout << "job b2 completed" << std::endl;
}

int main() {
    std::jthread thread1(worker1), thread2(worker2);
}
```
Now the code guarantees that a2 and b2 will always come after a1 and b1
```
job a1 completed
job b1 completed
job a2 completed
job b2 completed
```
### Going further
We can generalize this pattern to N threads, which is called the **barrier pattern**
This is done by keeping count of the amount of threads that have reached the meet up point using a counter variable.
```cpp
#include <semaphore>
#include <iostream>
#include <thread>
#include <vector>

#define NUM_THREADS 10

std::binary_semaphore lock{1}, barrier{0};

int count = 0;

void thread_safe_increment() {
    lock.acquire();
    count++;
    lock.release();
}

void worker() {
    std::cout << "executing" << std::endl;
    thread_safe_increment();

    if (count == NUM_THREADS) {
        barrier.release();
    }

    barrier.acquire();
    barrier.release();
    std::cout << "passed the barrier" << std::endl;
}

void test() {
    std::vector<std::jthread> threads(NUM_THREADS);
    for(int i = 0; i < NUM_THREADS; i++) {
        threads.emplace_back(worker);
    }
}

int main() {
    test();
    std::cout << count << std::endl;
}
```
This particular implementation uses what we call a **turnstile** to block the threads before continuing. Its called a turnstile because it only allows one thread to pass at a time.
```cpp
// what a turnstile looks like
if (count == NUM_THREADS) {
	barrier.release();
}

barrier.acquire();
barrier.release();
```
I hope you learnt something from this article!