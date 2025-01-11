pub fn single<T>(vec: Vec<T>) -> Result<T, &'static str> {
    if vec.len() == 1 {
        Ok(vec.into_iter().next().unwrap())
    } else {
        Err("Expected exactly one element")
    }
}
