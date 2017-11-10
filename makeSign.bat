:: BABYTIMER
:: Sign and align APK from a release-unsigned version
:: by Frederic Huguenin, nov 9th 2017

@ECHO OFF
SET built_dir=C:\Users\Fred\Documents\MyApp\babyTimer\platforms\android\build\outputs\apk
SET release_dir=C:\Users\Fred\Documents\MyApp\babyTimer\release
SET keystore_dir=C:\Users\Fred\Documents\MyApp\
SET keystore_file=myapp.keystore

:: 1- CLEAN OR CREATE RELEASE DIRECTORY
ECHO Clean or Create Release directory
IF EXIST "%release_dir%" (
	del /q "%release_dir%"
) ELSE (
	mkdir %release_dir%
)
cd %release_dir%

:: 4- copy unsigned apk to /release
ECHO Copy release unsigned apk into release dir
copy /y "%built_dir%\android-release-unsigned.apk" ".\"

:: 5- SIGN APK
jarsigner -keystore %keystore_dir%\%keystore_file% -storepass 1245app -sigalg SHA1withRSA -digestalg SHA1 android-release-unsigned.apk myappkey -signedjar babytimer-signed.apk

:: 6- ALIGN APK
zipalign 4 babytimer-signed.apk babytimer.apk

:: back to babytimer directory
cd ..




:: https://technet.microsoft.com/fr-fr/library/bb490890.aspx

::del 
::/p Prompts for confirmation before deleting the specified file.
::/f Forces deletion of read-only files.
::/s Deletes specified files from the current directory and all subdirectories. Displays the names of the files as they are being deleted.
::/q Specifies quiet mode. You are not prompted for delete confirmation.
::<Names> Specifies a list of one or more files or directories. Wildcards may be used to delete multiple files. If a directory is specified, all files within the ::directory will be deleted.

:: copy [/n] [{/y|/-y}] [/z] [{/a|/b}] Source [{/a|/b}] [+ Source [{/a|/b}] [+ ...]] [Destination [{/a|/b}]]
::/n   : Uses a short file name, if available, when copying a file with a name longer than eight characters, or with a file extension longer than three characters.
::/y   : Suppresses prompting to confirm that you want to overwrite an existing destination file.
::/-y   : Prompts you to confirm that you want to overwrite an existing destination file.
::/z   : Copies networked files in restartable mode.
::/a   : Indicates an ASCII text file.
::/b   : Indicates a binary file.
::Source   : Required. Specifies the location from which you want to copy a file or set of files. Source can consist of a drive letter and colon, a folder name, a file name, or a combination of these.
::Destination   : Required. Specifies the location to which you want to copy a file or set of files. Destination can consist of a drive letter and colon, a folder name, a file name, or a combination of these.

::if
::IF EXIST [filename] (
::) ELSE (
::)

