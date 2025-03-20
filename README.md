# PPL-Assignment2-L3
 # Lab E: Linking ELF Object Files

## Overview
This lab focuses on parsing and merging ELF (Executable and Linkable Format) files using the **mmap** system call for reading and the **write()** system call for writing. The assignment involves examining ELF headers, parsing sections and symbols, and merging two ELF files into a single relocatable object file.

## Requirements
- Implement a **limited pass I operation of a linker**.
- Extract and manipulate **ELF headers, section headers, and symbol tables**.
- Use **mmap()** instead of traditional read operations.
- Ensure compatibility with **32-bit ELF files**.
- Support **basic merging of ELF files** under certain constraints.

## Implementation Details

### Part 0: ELF File Examination
1. **Toggle Debug Mode** - Enables/disables debug messages.
2. **Examine ELF File** - Reads an ELF file and extracts:
   - Magic number (bytes 1-3)
   - Data encoding scheme
   - Entry point (hexadecimal)
   - Section header table offset and size
   - Program header table offset and size
3. **Print Section Names** - Lists all sections, including:
   - Index, Name, Address, Offset, Size, Type
4. **Print Symbols** - Lists symbols along with their:
   - Index, Value, Section Index, Section Name, Symbol Name

### Part 1: ELF Sections
- Retrieve **section header table** from an ELF file.
- Extract and **display section names** using `.shstrtab`.
- Use **symbolic names for section types** (not raw numbers).

### Part 2: ELF Symbols
- Retrieve **symbol table** from an ELF file.
- Extract and **display symbols** using `.strtab`.
- For each symbol, show:
  - Index, Value, Section Index, Section Name, Symbol Name

### Part 3: ELF File Merging
- **Check Files for Merge:**
  - Ensure two ELF files are loaded.
  - Verify that each file contains **exactly one** symbol table.
  - Ensure no symbol is **multiply defined or undefined**.
- **Merge ELF Files (Bonus):**
  - Concatenate **text, data, and rodata** sections.
  - Preserve **.shstrtab, .symtab, and relocation sections**.
  - Generate a merged ELF relocatable object file **out.ro**.

## Constraints
- The program **must only use mmap()** for reading ELF files.
- **No standard read or fread operations** allowed.
- Supports **only 32-bit ELF files** (-m32 flag required for compilation).
- Merging assumes:
  - Only **two ELF files** are merged.
  - The second ELF file does not introduce **new sections or symbols**.
  - No relocation sections exist in the second ELF file.

## Compilation and Execution
### Compilation
Use the provided `Makefile` to compile the program:
```sh
make
```

### Running the Program
```sh
./myELF
```
Then follow the on-screen menu to load ELF files, print section headers, symbols, and attempt merging.

## Testing
- Use `readelf -h`, `readelf -S`, and `readelf -s` for verification.
- Test ELF files from the **ELF object file examples** folder.
- Test file merging with:
  ```sh
  ld -r -m elf_i386 F1a.o F2a.o -o F12a.ro
  ```
  And compare results with `out.ro`.

## Deliverables
- `myELF.c`: C source file implementing all functionality.
- `Makefile`: Compiles and links `myELF.c`.
- Any additional necessary header files.

## Notes
- Debug mode prints offsets and indices for easier troubleshooting.
- **Bonus points**: If `out.ro` successfully links to an executable (`ld -m elf_i386 out.ro -o final_exec`).

## Authors
- **Yarin Binyamin** (GitHub: `YarinBinyamin`)

