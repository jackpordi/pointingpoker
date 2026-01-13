fn main() {
    // Trigger TypeScript type generation
    println!("cargo:rerun-if-changed=src/types/messages.rs");
    
    // Generate types during build
    // Note: ts-rs generates types when export() is called, typically in tests
    // We'll generate them via a test run or manual invocation
}

